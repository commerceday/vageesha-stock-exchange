import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MutualFund } from '@/utils/mutual-funds-data';

interface MFInvestDialogProps {
  fund: (MutualFund & { lastUpdated: Date }) | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export function MFInvestDialog({ fund, open, onOpenChange, onSuccess }: MFInvestDialogProps) {
  const [amount, setAmount] = useState(5000);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!fund) return null;

  // Calculate units based on NAV
  const units = amount / fund.nav;

  const handleInvest = async () => {
    if (amount < fund.minInvestment) {
      toast({
        title: "Minimum investment required",
        description: `Minimum investment for this fund is ${formatCurrency(fund.minInvestment)}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get current balance - use maybeSingle to handle missing profile
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .maybeSingle();

      // If profile doesn't exist, create it with default balance
      if (!profile) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || null,
            balance: 500000
          })
          .select('balance')
          .single();
        
        if (insertError) throw new Error('Failed to create profile: ' + insertError.message);
        profile = newProfile;
      } else if (profileError) {
        throw profileError;
      }

      if (profile.balance < amount) {
        toast({
          title: "Insufficient balance",
          description: `You need ${formatCurrency(amount)} but only have ${formatCurrency(profile.balance)}`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          stock_symbol: fund.symbol,
          stock_name: fund.name,
          transaction_type: 'buy',
          quantity: Math.floor(units * 1000) / 1000, // 3 decimal places for MF units
          price_per_unit: fund.nav,
          total_amount: amount
        });

      if (transactionError) throw transactionError;

      // Check if user already owns this fund
      const { data: existingInvestment } = await supabase
        .from('user_investments')
        .select('*')
        .eq('user_id', user.id)
        .eq('stock_symbol', fund.symbol)
        .single();

      if (existingInvestment) {
        // Update existing investment
        const newUnits = existingInvestment.quantity + units;
        const avgNav = ((existingInvestment.purchase_price * existingInvestment.quantity) + amount) / newUnits;
        
        const { error: updateError } = await supabase
          .from('user_investments')
          .update({
            quantity: Math.floor(newUnits * 1000) / 1000,
            purchase_price: avgNav
          })
          .eq('id', existingInvestment.id);

        if (updateError) throw updateError;
      } else {
        // Create new investment
        const { error: investmentError } = await supabase
          .from('user_investments')
          .insert({
            user_id: user.id,
            stock_symbol: fund.symbol,
            stock_name: fund.name,
            quantity: Math.floor(units * 1000) / 1000,
            purchase_price: fund.nav
          });

        if (investmentError) throw investmentError;
      }

      // Update balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: profile.balance - amount })
        .eq('id', user.id);

      if (balanceError) throw balanceError;

      toast({
        title: "Investment successful!",
        description: `Invested ${formatCurrency(amount)} in ${fund.name} (${units.toFixed(3)} units)`,
      });

      setAmount(5000);
      onOpenChange(false);
      onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: "Investment failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user's investment in this fund
      const { data: investment, error: investmentError } = await supabase
        .from('user_investments')
        .select('*')
        .eq('user_id', user.id)
        .eq('stock_symbol', fund.symbol)
        .single();

      if (investmentError || !investment) {
        toast({
          title: "No units to redeem",
          description: `You don't own any units of ${fund.name}`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const unitsToRedeem = amount / fund.nav;
      
      if (investment.quantity < unitsToRedeem) {
        const maxRedeemable = investment.quantity * fund.nav;
        toast({
          title: "Insufficient units",
          description: `You can redeem maximum ${formatCurrency(maxRedeemable)}`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          stock_symbol: fund.symbol,
          stock_name: fund.name,
          transaction_type: 'sell',
          quantity: Math.floor(unitsToRedeem * 1000) / 1000,
          price_per_unit: fund.nav,
          total_amount: amount
        });

      if (transactionError) throw transactionError;

      // Update or delete investment
      const remainingUnits = investment.quantity - unitsToRedeem;
      
      if (remainingUnits < 0.001) {
        // Redeem all - delete the investment
        const { error: deleteError } = await supabase
          .from('user_investments')
          .delete()
          .eq('id', investment.id);

        if (deleteError) throw deleteError;
      } else {
        // Partial redemption - update quantity
        const { error: updateError } = await supabase
          .from('user_investments')
          .update({ quantity: Math.floor(remainingUnits * 1000) / 1000 })
          .eq('id', investment.id);

        if (updateError) throw updateError;
      }

      // Update balance
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();

      if (profile) {
        const { error: balanceError } = await supabase
          .from('profiles')
          .update({ balance: profile.balance + amount })
          .eq('id', user.id);

        if (balanceError) throw balanceError;
      }

      toast({
        title: "Redemption successful!",
        description: `Redeemed ${formatCurrency(amount)} from ${fund.name}`,
      });

      setAmount(5000);
      onOpenChange(false);
      onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: "Redemption failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="line-clamp-1">{fund.name}</DialogTitle>
          <DialogDescription>
            Current NAV: {formatCurrency(fund.nav)} • Min: {formatCurrency(fund.minInvestment)}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="invest" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invest">Invest</TabsTrigger>
            <TabsTrigger value="redeem">Redeem</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invest" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invest-amount">Amount (₹)</Label>
              <Input
                id="invest-amount"
                type="number"
                min={fund.minInvestment}
                step={100}
                value={amount}
                onChange={(e) => setAmount(Math.max(fund.minInvestment, parseInt(e.target.value) || fund.minInvestment))}
              />
            </div>
            <div className="p-3 bg-muted rounded-md space-y-2">
              <div className="flex justify-between text-sm">
                <span>Investment Amount:</span>
                <span className="font-semibold">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Units (approx):</span>
                <span className="font-semibold">{units.toFixed(3)}</span>
              </div>
            </div>
            <Button onClick={handleInvest} disabled={loading} className="w-full">
              {loading ? 'Processing...' : `Invest ${formatCurrency(amount)}`}
            </Button>
          </TabsContent>
          
          <TabsContent value="redeem" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="redeem-amount">Amount (₹)</Label>
              <Input
                id="redeem-amount"
                type="number"
                min={100}
                step={100}
                value={amount}
                onChange={(e) => setAmount(Math.max(100, parseInt(e.target.value) || 100))}
              />
            </div>
            <div className="p-3 bg-muted rounded-md space-y-2">
              <div className="flex justify-between text-sm">
                <span>Redemption Amount:</span>
                <span className="font-semibold">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Units to redeem:</span>
                <span className="font-semibold">{(amount / fund.nav).toFixed(3)}</span>
              </div>
            </div>
            <Button onClick={handleRedeem} disabled={loading} className="w-full" variant="destructive">
              {loading ? 'Processing...' : `Redeem ${formatCurrency(amount)}`}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
