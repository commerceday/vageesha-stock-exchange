import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Stock } from '@/utils/stocksApi';
import { formatCurrency } from '@/utils/stocksApi';

interface BuySellDialogProps {
  stock: Stock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BuySellDialog({ stock, open, onOpenChange, onSuccess }: BuySellDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!stock) return null;

  const totalCost = stock.price * quantity;

  const handleBuy = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get current balance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

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
          stock_symbol: stock.symbol,
          stock_name: stock.name,
          transaction_type: 'buy',
          quantity,
          price_per_unit: stock.price,
          total_amount: totalCost
        });

      if (transactionError) throw transactionError;

      // Check if user already owns this stock
      const { data: existingInvestment } = await supabase
        .from('user_investments')
        .select('*')
        .eq('user_id', user.id)
        .eq('stock_symbol', stock.symbol)
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
            stock_symbol: stock.symbol,
            stock_name: stock.name,
            quantity,
            purchase_price: stock.price
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
        description: `Bought ${quantity} shares of ${stock.symbol} for ${formatCurrency(totalCost)}`,
      });

      setQuantity(1);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Purchase failed",
        description: error.message,
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

      // Get user's investment in this stock
      const { data: investment, error: investmentError } = await supabase
        .from('user_investments')
        .select('*')
        .eq('user_id', user.id)
        .eq('stock_symbol', stock.symbol)
        .single();

      if (investmentError || !investment) {
        toast({
          title: "No shares to sell",
          description: `You don't own any shares of ${stock.symbol}`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (investment.quantity < quantity) {
        toast({
          title: "Insufficient shares",
          description: `You only own ${investment.quantity} shares`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const saleAmount = stock.price * quantity;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          stock_symbol: stock.symbol,
          stock_name: stock.name,
          transaction_type: 'sell',
          quantity,
          price_per_unit: stock.price,
          total_amount: saleAmount
        });

      if (transactionError) throw transactionError;

      // Update or delete investment
      if (investment.quantity === quantity) {
        // Sell all shares - delete the investment
        const { error: deleteError } = await supabase
          .from('user_investments')
          .delete()
          .eq('id', investment.id);

        if (deleteError) throw deleteError;
      } else {
        // Sell partial shares - update quantity
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
        description: `Sold ${quantity} shares of ${stock.symbol} for ${formatCurrency(saleAmount)}`,
      });

      setQuantity(1);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Sale failed",
        description: error.message,
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
          <DialogTitle>{stock.name} ({stock.symbol})</DialogTitle>
          <DialogDescription>
            Current Price: {formatCurrency(stock.price)}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buy-quantity">Quantity</Label>
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
              {loading ? 'Processing...' : `Buy ${quantity} Share${quantity > 1 ? 's' : ''}`}
            </Button>
          </TabsContent>
          
          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sell-quantity">Quantity</Label>
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
              {loading ? 'Processing...' : `Sell ${quantity} Share${quantity > 1 ? 's' : ''}`}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
