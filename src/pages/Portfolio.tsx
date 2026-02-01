import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, formatPercentage } from '@/utils/stocksApi';
import { TrendingUp, TrendingDown, Wallet, Activity, BarChart, Landmark, Layers } from 'lucide-react';
import { mockStocks } from '@/utils/stocksApi';
import { mutualFundsData } from '@/utils/mutual-funds-data';
import { etfData } from '@/utils/etf-data';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface Investment {
  id: string;
  stock_symbol: string;
  stock_name: string;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
  type?: 'stock' | 'mf' | 'etf';
}

interface Transaction {
  id: string;
  stock_symbol: string;
  stock_name: string;
  transaction_type: string;
  quantity: number;
  price_per_unit: number;
  total_amount: number;
  transaction_date: string;
}

const Portfolio = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch investments
      const { data: investmentsData } = await supabase
        .from('user_investments')
        .select('*')
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });

      // Fetch transactions
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })
        .limit(10);

      // Fetch balance
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();

      // Categorize investments by type
      const categorizedInvestments = (investmentsData || []).map(inv => {
        const symbol = inv.stock_symbol;
        let type: 'stock' | 'mf' | 'etf' = 'stock';
        
        if (mutualFundsData.find(mf => mf.symbol === symbol)) {
          type = 'mf';
        } else if (etfData.find(etf => etf.symbol === symbol)) {
          type = 'etf';
        }
        
        return { ...inv, type };
      });

      setInvestments(categorizedInvestments);
      setTransactions(transactionsData || []);
      setBalance(profile?.balance || 0);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLivePrices = async (symbols: string[]) => {
    if (!symbols.length) return;
    try {
      const { data, error } = await supabase.functions.invoke('fetch-stock-prices', {
        body: { symbols: symbols.map((s) => ({ symbol: s })) },
      });
      if (error) {
        console.error('Error fetching live prices:', error);
        return;
      }
      const payload: any = data as any;
      const items = payload?.data || [];
      const priceMap: Record<string, number> = {};
      for (const item of items) {
        if (item && typeof item.price === 'number' && item.price > 0) {
          priceMap[item.symbol] = item.price;
        }
      }
      setCurrentPrices((prev) => ({ ...prev, ...priceMap }));
    } catch (err) {
      console.error('Live price fetch failed:', err);
    }
  };

  useEffect(() => {
    if (!investments.length) return;
    const stockSymbols = investments
      .filter(inv => inv.type === 'stock')
      .map(inv => inv.stock_symbol);
    if (stockSymbols.length > 0) {
      fetchLivePrices(stockSymbols);
      const interval = setInterval(() => fetchLivePrices(stockSymbols), 30000);
      return () => clearInterval(interval);
    }
  }, [investments]);

  const getCurrentPrice = (symbol: string, type: 'stock' | 'mf' | 'etf' = 'stock') => {
    // Check live prices first
    const live = currentPrices[symbol];
    if (typeof live === 'number' && live > 0) return live;

    // Fallback to mock data based on type
    if (type === 'mf') {
      const mf = mutualFundsData.find(m => m.symbol === symbol);
      return mf?.nav || 0;
    }
    if (type === 'etf') {
      const etf = etfData.find(e => e.symbol === symbol);
      return etf?.price || 0;
    }
    
    const stock = mockStocks.find((s) => s.symbol === symbol);
    return stock?.price || 0;
  };

  const stockInvestments = investments.filter(inv => inv.type === 'stock');
  const mfInvestments = investments.filter(inv => inv.type === 'mf');
  const etfInvestments = investments.filter(inv => inv.type === 'etf');

  const calculateTotals = (invList: Investment[]) => {
    const totalValue = invList.reduce((total, inv) => {
      const currentPrice = getCurrentPrice(inv.stock_symbol, inv.type);
      return total + (currentPrice * inv.quantity);
    }, 0);

    const totalInvested = invList.reduce((total, inv) => {
      return total + (inv.purchase_price * inv.quantity);
    }, 0);

    const pnl = totalValue - totalInvested;
    const pnlPercent = totalInvested > 0 ? (pnl / totalInvested) * 100 : 0;

    return { totalValue, totalInvested, pnl, pnlPercent };
  };

  const stockTotals = calculateTotals(stockInvestments);
  const mfTotals = calculateTotals(mfInvestments);
  const etfTotals = calculateTotals(etfInvestments);

  const grandTotalValue = stockTotals.totalValue + mfTotals.totalValue + etfTotals.totalValue;
  const grandTotalInvested = stockTotals.totalInvested + mfTotals.totalInvested + etfTotals.totalInvested;
  const grandTotalPnL = grandTotalValue - grandTotalInvested;
  const grandTotalPnLPercent = grandTotalInvested > 0 ? (grandTotalPnL / grandTotalInvested) * 100 : 0;

  const renderInvestmentTable = (invList: Investment[], type: 'stock' | 'mf' | 'etf') => {
    if (invList.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No {type === 'stock' ? 'stock' : type === 'mf' ? 'mutual fund' : 'ETF'} holdings yet. Start investing to see them here!
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">{type === 'mf' ? 'Fund' : type === 'etf' ? 'ETF' : 'Stock'}</th>
              <th className="text-right py-3 px-4">{type === 'mf' ? 'Units' : 'Qty'}</th>
              <th className="text-right py-3 px-4">{type === 'mf' ? 'Avg NAV' : 'Avg Price'}</th>
              <th className="text-right py-3 px-4">{type === 'mf' ? 'Current NAV' : 'Current Price'}</th>
              <th className="text-right py-3 px-4">Total Value</th>
              <th className="text-right py-3 px-4">P&L</th>
            </tr>
          </thead>
          <tbody>
            {invList.map((inv) => {
              const currentPrice = getCurrentPrice(inv.stock_symbol, type);
              const currentValue = currentPrice * inv.quantity;
              const investedValue = inv.purchase_price * inv.quantity;
              const pnl = currentValue - investedValue;
              const pnlPercent = (pnl / investedValue) * 100;

              return (
                <tr key={inv.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-semibold">{inv.stock_symbol}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{inv.stock_name}</div>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">{inv.quantity}</td>
                  <td className="text-right py-3 px-4">{formatCurrency(inv.purchase_price)}</td>
                  <td className="text-right py-3 px-4">{formatCurrency(currentPrice)}</td>
                  <td className="text-right py-3 px-4 font-semibold">
                    {formatCurrency(currentValue)}
                  </td>
                  <td className={`text-right py-3 px-4 ${pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                    <div className="font-semibold">{formatCurrency(Math.abs(pnl))}</div>
                    <div className="text-xs">({formatPercentage(pnlPercent)})</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <PageLayout title="Portfolio">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Portfolio">
      <div className="space-y-6">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Invested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(grandTotalInvested)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(grandTotalValue)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total P&L
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {grandTotalPnL >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-danger" />
                )}
                <p className={`text-2xl font-bold ${grandTotalPnL >= 0 ? 'text-success' : 'text-danger'}`}>
                  {formatCurrency(Math.abs(grandTotalPnL))}
                </p>
                <span className={`text-sm ${grandTotalPnL >= 0 ? 'text-success' : 'text-danger'}`}>
                  ({formatPercentage(grandTotalPnLPercent)})
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  <span className="font-medium">Stocks</span>
                </div>
                <Badge variant="outline">{stockInvestments.length} holdings</Badge>
              </div>
              <p className="text-2xl font-bold mt-2">{formatCurrency(stockTotals.totalValue)}</p>
              <p className={cn(
                "text-sm",
                stockTotals.pnl >= 0 ? "text-success" : "text-danger"
              )}>
                {stockTotals.pnl >= 0 ? '+' : ''}{formatCurrency(stockTotals.pnl)} ({formatPercentage(stockTotals.pnlPercent)})
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-primary" />
                  <span className="font-medium">Mutual Funds</span>
                </div>
                <Badge variant="outline">{mfInvestments.length} holdings</Badge>
              </div>
              <p className="text-2xl font-bold mt-2">{formatCurrency(mfTotals.totalValue)}</p>
              <p className={cn(
                "text-sm",
                mfTotals.pnl >= 0 ? "text-success" : "text-danger"
              )}>
                {mfTotals.pnl >= 0 ? '+' : ''}{formatCurrency(mfTotals.pnl)} ({formatPercentage(mfTotals.pnlPercent)})
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  <span className="font-medium">ETFs</span>
                </div>
                <Badge variant="outline">{etfInvestments.length} holdings</Badge>
              </div>
              <p className="text-2xl font-bold mt-2">{formatCurrency(etfTotals.totalValue)}</p>
              <p className={cn(
                "text-sm",
                etfTotals.pnl >= 0 ? "text-success" : "text-danger"
              )}>
                {etfTotals.pnl >= 0 ? '+' : ''}{formatCurrency(etfTotals.pnl)} ({formatPercentage(etfTotals.pnlPercent)})
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Holdings Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>My Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="stocks" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stocks" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  Stocks ({stockInvestments.length})
                </TabsTrigger>
                <TabsTrigger value="mf" className="flex items-center gap-2">
                  <Landmark className="h-4 w-4" />
                  Mutual Funds ({mfInvestments.length})
                </TabsTrigger>
                <TabsTrigger value="etf" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  ETFs ({etfInvestments.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="stocks" className="mt-4">
                {renderInvestmentTable(stockInvestments, 'stock')}
              </TabsContent>
              
              <TabsContent value="mf" className="mt-4">
                {renderInvestmentTable(mfInvestments, 'mf')}
              </TabsContent>
              
              <TabsContent value="etf" className="mt-4">
                {renderInvestmentTable(etfInvestments, 'etf')}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions yet
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-3 rounded-md border"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${txn.transaction_type === 'buy' ? 'bg-success/10' : 'bg-danger/10'}`}>
                        {txn.transaction_type === 'buy' ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-danger" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {txn.transaction_type.toUpperCase()} {txn.quantity} x {txn.stock_symbol}
                        </div>
                        <div className="text-sm text-muted-foreground">{txn.stock_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(txn.transaction_date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(txn.total_amount)}</div>
                      <div className="text-sm text-muted-foreground">
                        @ {formatCurrency(txn.price_per_unit)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Portfolio;
