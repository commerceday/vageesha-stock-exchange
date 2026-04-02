import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { MutualFund } from '@/utils/mutual-funds-data';
import { executeTrade } from '@/utils/tradeApi';

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

  const units = amount / fund.nav;

  const handleTrade = async (action: 'buy' | 'sell') => {
    if (action === 'buy' && amount < fund.minInvestment) {
      toast({
        title: "Minimum investment required",
        description: `Minimum investment for this fund is ${formatCurrency(fund.minInvestment)}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const tradeQuantity = action === 'buy'
        ? Math.floor(units * 1000) / 1000
        : Math.floor((amount / fund.nav) * 1000) / 1000;

      const result = await executeTrade({
        action,
        stock_symbol: fund.symbol,
        stock_name: fund.name,
        quantity: tradeQuantity,
        price_per_unit: fund.nav,
      });

      if (!result.success) {
        toast({
          title: action === 'buy' ? 'Investment failed' : 'Redemption failed',
          description: result.error || 'An error occurred',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: action === 'buy' ? 'Investment successful!' : 'Redemption successful!',
        description: action === 'buy'
          ? `Invested ${formatCurrency(amount)} in ${fund.name} (${tradeQuantity.toFixed(3)} units)`
          : `Redeemed ${formatCurrency(amount)} from ${fund.name}`,
      });

      setAmount(5000);
      onOpenChange(false);
      onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: action === 'buy' ? 'Investment failed' : 'Redemption failed',
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
            <Button onClick={() => handleTrade('buy')} disabled={loading} className="w-full">
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
            <Button onClick={() => handleTrade('sell')} disabled={loading} className="w-full" variant="destructive">
              {loading ? 'Processing...' : `Redeem ${formatCurrency(amount)}`}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
