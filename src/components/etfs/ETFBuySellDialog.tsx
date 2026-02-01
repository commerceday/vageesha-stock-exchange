import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ETF } from '@/utils/etf-data';

interface ETFBuySellDialogProps {
  etf: (ETF & { lastUpdated: Date }) | null;
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

export function ETFBuySellDialog({ etf, open, onOpenChange, onSuccess }: ETFBuySellDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!etf) return null;

  const totalCost = etf.price * quantity;

  const handleBuy = async () => {
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

      if (profile.balance < totalCost) {
        toast({
          title: "Insufficient balance",
          description: `You need ${formatCurrency(totalCost)} but only have ${formatCurrency(profile.balance)}`,
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
          stock_symbol: etf.symbol,
          stock_name: etf.name,
          transaction_type: 'buy',
          quantity,
          price_per_unit: etf.price,
          total_amount: totalCost
        });

      if (transactionError) throw transactionError;

      // Check if user already owns this ETF
      const { data: existingInvestment } = await supabase
        .from('user_investments')
        .select('*')
        .eq('user_id', user.id)
        .eq('stock_symbol', etf.symbol)
        .single();

      if (existingInvestment) {
        // Update existing investment
        const newQuantity = existingInvestment.quantity + quantity;
        const avgPrice = ((existingInvestment.purchase_price * existingInvestment.quantity) + totalCost) / newQuantity;
        
        const { error: updateError } = await supabase
          .from('user_investments')
          .update({
            quantity: newQuantity,
            purchase_price: avgPrice
          })
          .eq('id', existingInvestment.id);

        if (updateError) throw updateError;
      } else {
        // Create new investment
        const { error: investmentError } = await supabase
          .from('user_investments')
          .insert({
            user_id: user.id,
            stock_symbol: etf.symbol,
            stock_name: etf.name,
            quantity,
            purchase_price: etf.price
          });

        if (investmentError) throw investmentError;
      }

      // Update balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: profile.balance - totalCost })
        .eq('id', user.id);

      if (balanceError) throw balanceError;

      toast({
        title: "Purchase successful!",
        description: `Bought ${quantity} units of ${etf.symbol} for ${formatCurrency(totalCost)}`,
      });

      setQuantity(1);
      onOpenChange(false);
      onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: "Purchase failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user's investment in this ETF
      const { data: investment, error: investmentError } = await supabase
        .from('user_investments')
        .select('*')
        .eq('user_id', user.id)
        .eq('stock_symbol', etf.symbol)
        .single();

      if (investmentError || !investment) {
        toast({
          title: "No units to sell",
          description: `You don't own any units of ${etf.symbol}`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (investment.quantity < quantity) {
        toast({
          title: "Insufficient units",
          description: `You only own ${investment.quantity} units`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const saleAmount = etf.price * quantity;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          stock_symbol: etf.symbol,
          stock_name: etf.name,
          transaction_type: 'sell',
          quantity,
          price_per_unit: etf.price,
          total_amount: saleAmount
        });

      if (transactionError) throw transactionError;

      // Update or delete investment
      if (investment.quantity === quantity) {
        // Sell all units - delete the investment
        const { error: deleteError } = await supabase
          .from('user_investments')
          .delete()
          .eq('id', investment.id);

        if (deleteError) throw deleteError;
      } else {
        // Sell partial units - update quantity
        const { error: updateError } = await supabase
          .from('user_investments')
          .update({ quantity: investment.quantity - quantity })
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
          .update({ balance: profile.balance + saleAmount })
          .eq('id', user.id);

        if (balanceError) throw balanceError;
      }

      toast({
        title: "Sale successful!",
        description: `Sold ${quantity} units of ${etf.symbol} for ${formatCurrency(saleAmount)}`,
      });

      setQuantity(1);
      onOpenChange(false);
      onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: "Sale failed",
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
          <DialogTitle>{etf.symbol}</DialogTitle>
          <DialogDescription>
            {etf.name} • Price: {formatCurrency(etf.price)}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buy-quantity">Quantity (Units)</Label>
              <Input
                id="buy-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <div className="p-3 bg-muted rounded-md">
              <div className="flex justify-between text-sm">
                <span>Total Cost:</span>
                <span className="font-semibold">{formatCurrency(totalCost)}</span>
              </div>
            </div>
            <Button onClick={handleBuy} disabled={loading} className="w-full">
              {loading ? 'Processing...' : `Buy ${quantity} Unit${quantity > 1 ? 's' : ''}`}
            </Button>
          </TabsContent>
          
          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sell-quantity">Quantity (Units)</Label>
              <Input
                id="sell-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <div className="p-3 bg-muted rounded-md">
              <div className="flex justify-between text-sm">
                <span>Total Value:</span>
                <span className="font-semibold">{formatCurrency(totalCost)}</span>
              </div>
            </div>
            <Button onClick={handleSell} disabled={loading} className="w-full" variant="destructive">
              {loading ? 'Processing...' : `Sell ${quantity} Unit${quantity > 1 ? 's' : ''}`}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
