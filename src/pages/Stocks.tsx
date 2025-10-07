import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useStockData, mockStocks, generatePriceHistory } from '@/utils/stocksApi';
import { StockCard } from '@/components/stocks/StockCard';
import { StockChart } from '@/components/stocks/StockChart';
import { BuySellDialog } from '@/components/stocks/BuySellDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search } from 'lucide-react';

const Stocks = () => {
  const stocks = useStockData(mockStocks);
  const [selectedStock, setSelectedStock] = React.useState(stocks[0]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const stocksWithHistory = stocks.map(stock => {
    return {
      ...stock,
      priceHistory: generatePriceHistory(30, stock.price, 2)
    };
  });

  // Filter stocks based on search query
  const filteredStocks = stocksWithHistory.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <PageLayout title="Stocks">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold">All Stocks</h2>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search stocks by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => (
              <StockCard 
                key={stock.symbol} 
                stock={stock} 
                priceHistory={stock.priceHistory}
                onClick={() => setSelectedStock(stock)}
                className={selectedStock.symbol === stock.symbol ? "ring-2 ring-primary" : ""}
              />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No stocks found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{selectedStock.name}</h2>
            <Button onClick={() => setDialogOpen(true)}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy/Sell
            </Button>
          </div>
          
          <StockChart 
            symbol={selectedStock.symbol} 
            name={selectedStock.name} 
            currentPrice={selectedStock.price}
            volatility={2.5}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-card rounded-lg p-4 shadow">
              <h3 className="font-medium text-sm text-muted-foreground">Market Cap</h3>
              <p className="text-xl font-semibold mt-1">
                ₹{(selectedStock.marketCap / 10000000).toFixed(2)}Cr
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 shadow">
              <h3 className="font-medium text-sm text-muted-foreground">Volume</h3>
              <p className="text-xl font-semibold mt-1">
                {(selectedStock.volume / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 shadow">
              <h3 className="font-medium text-sm text-muted-foreground">52W Range</h3>
              <p className="text-xl font-semibold mt-1">
                ₹{(selectedStock.price * 0.8).toFixed(2)} - ₹{(selectedStock.price * 1.2).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <BuySellDialog
        stock={selectedStock}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </PageLayout>
  );
};

export default Stocks;
