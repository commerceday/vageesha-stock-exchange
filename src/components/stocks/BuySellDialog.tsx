import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Stock } from '@/utils/stocksApi';
import { formatCurrency } from '@/utils/stocksApi';
import { executeTrade } from '@/utils/tradeApi';

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

  const handleTrade = async (action: 'buy' | 'sell') => {
    setLoading(true);
    try {
      const result = await executeTrade({
        action,
        stock_symbol: stock.symbol,
        stock_name: stock.name,
        quantity,
        price_per_unit: stock.price,
      });

      if (!result.success) {
        toast({
          title: action === 'buy' ? 'Purchase failed' : 'Sale failed',
          description: result.error || 'An error occurred',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: action === 'buy' ? 'Purchase successful!' : 'Sale successful!',
        description: `${action === 'buy' ? 'Bought' : 'Sold'} ${quantity} share${quantity > 1 ? 's' : ''} of ${stock.symbol} for ${formatCurrency(totalCost)}`,
      });

      setQuantity(1);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: action === 'buy' ? 'Purchase failed' : 'Sale failed',
        description: error.message || 'An error occurred',
        variant: 'destructive',
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
            <Button onClick={() => handleTrade('buy')} disabled={loading} className="w-full">
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
            <Button onClick={() => handleTrade('sell')} disabled={loading} className="w-full" variant="destructive">
              {loading ? 'Processing...' : `Sell ${quantity} Share${quantity > 1 ? 's' : ''}`}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
