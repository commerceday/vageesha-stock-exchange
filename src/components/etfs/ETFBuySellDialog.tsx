import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ETF } from '@/utils/etf-data';
import { executeTrade } from '@/utils/tradeApi';

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

  const handleTrade = async (action: 'buy' | 'sell') => {
    setLoading(true);
    try {
      const result = await executeTrade({
        action,
        stock_symbol: etf.symbol,
        stock_name: etf.name,
        quantity,
        price_per_unit: etf.price,
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
        description: `${action === 'buy' ? 'Bought' : 'Sold'} ${quantity} unit${quantity > 1 ? 's' : ''} of ${etf.symbol} for ${formatCurrency(totalCost)}`,
      });

      setQuantity(1);
      onOpenChange(false);
      onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: action === 'buy' ? 'Purchase failed' : 'Sale failed',
        description: errorMessage,
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
            <Button onClick={() => handleTrade('buy')} disabled={loading} className="w-full">
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
            <Button onClick={() => handleTrade('sell')} disabled={loading} className="w-full" variant="destructive">
              {loading ? 'Processing...' : `Sell ${quantity} Unit${quantity > 1 ? 's' : ''}`}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
