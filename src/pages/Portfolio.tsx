import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, formatPercentage } from '@/utils/stocksApi';
import { TrendingUp, TrendingDown, Wallet, Activity } from 'lucide-react';
import { mockStocks } from '@/utils/stocksApi';

interface Investment {
  id: string;
  stock_symbol: string;
  stock_name: string;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
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

      setInvestments(investmentsData || []);
      setTransactions(transactionsData || []);
      setBalance(profile?.balance || 0);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPrice = (symbol: string) => {
    const stock = mockStocks.find(s => s.symbol === symbol);
    return stock?.price || 0;
  };

  const calculateTotalValue = () => {
    return investments.reduce((total, inv) => {
      const currentPrice = getCurrentPrice(inv.stock_symbol);
      return total + (currentPrice * inv.quantity);
    }, 0);
  };

  const calculateTotalInvested = () => {
    return investments.reduce((total, inv) => {
      return total + (inv.purchase_price * inv.quantity);
    }, 0);
  };

  const totalValue = calculateTotalValue();
  const totalInvested = calculateTotalInvested();
  const totalPnL = totalValue - totalInvested;
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

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
              <p className="text-2xl font-bold">{formatCurrency(totalInvested)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
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
                {totalPnL >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(Math.abs(totalPnL))}
                </p>
                <span className={`text-sm ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ({formatPercentage(totalPnLPercent)})
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings */}
        <Card>
          <CardHeader>
            <CardTitle>My Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            {investments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No holdings yet. Start investing to see your portfolio here!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Stock</th>
                      <th className="text-right py-3 px-4">Qty</th>
                      <th className="text-right py-3 px-4">Avg Price</th>
                      <th className="text-right py-3 px-4">Current Price</th>
                      <th className="text-right py-3 px-4">Total Value</th>
                      <th className="text-right py-3 px-4">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((inv) => {
                      const currentPrice = getCurrentPrice(inv.stock_symbol);
                      const currentValue = currentPrice * inv.quantity;
                      const investedValue = inv.purchase_price * inv.quantity;
                      const pnl = currentValue - investedValue;
                      const pnlPercent = (pnl / investedValue) * 100;

                      return (
                        <tr key={inv.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-semibold">{inv.stock_symbol}</div>
                              <div className="text-sm text-muted-foreground">{inv.stock_name}</div>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4">{inv.quantity}</td>
                          <td className="text-right py-3 px-4">{formatCurrency(inv.purchase_price)}</td>
                          <td className="text-right py-3 px-4">{formatCurrency(currentPrice)}</td>
                          <td className="text-right py-3 px-4 font-semibold">
                            {formatCurrency(currentValue)}
                          </td>
                          <td className={`text-right py-3 px-4 ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            <div className="font-semibold">{formatCurrency(Math.abs(pnl))}</div>
                            <div className="text-xs">({formatPercentage(pnlPercent)})</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
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
                      <div className={`p-2 rounded-full ${txn.transaction_type === 'buy' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        {txn.transaction_type === 'buy' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
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
