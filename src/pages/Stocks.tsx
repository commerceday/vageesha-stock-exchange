import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useStockData, mockStocks, generatePriceHistory } from '@/utils/stocksApi';
import { StockCard } from '@/components/stocks/StockCard';
import { StockChart } from '@/components/stocks/StockChart';
import { BuySellDialog } from '@/components/stocks/BuySellDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Search, Filter, WifiOff } from 'lucide-react';
import { VirtualizedStockList } from '@/components/stocks/VirtualizedStockList';

const Stocks = () => {
  const { stocks, priceHistory, isMarketOpen, failedStocks } = useStockData(mockStocks);
  const [selectedStock, setSelectedStock] = React.useState(() => stocks[0] ?? mockStocks[0]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedSector, setSelectedSector] = React.useState<string>('all');

  // Get unique sectors from stocks
  const sectors = React.useMemo(() => {
    const uniqueSectors = Array.from(new Set(stocks.map(stock => stock.sector)));
    return uniqueSectors.sort();
  }, [stocks]);

  // Filter stocks based on search query and sector
  const filteredStocks = React.useMemo(() => {
    return stocks.filter(stock => {
      const matchesSearch = 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === 'all' || stock.sector === selectedSector;
      return matchesSearch && matchesSector;
    });
  }, [stocks, searchQuery, selectedSector]);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <PageLayout title="Stocks">
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
          <span className="text-sm text-muted-foreground">
            Market is {isMarketOpen ? 'OPEN' : 'CLOSED'} 
            {!isMarketOpen && ' (Using pattern-based simulation)'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{filteredStocks.length} of {stocks.length} stocks</span>
          {isMarketOpen && failedStocks.size > 0 && (
            <span className="text-danger flex items-center gap-1">
              <WifiOff className="h-3 w-3" />
              {failedStocks.size} failed
            </span>
          )}
        </div>
      </div>
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

          {/* Sector Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <VirtualizedStockList
            stocks={filteredStocks}
            priceHistory={priceHistory}
            selectedStock={selectedStock}
            onStockClick={setSelectedStock}
          />
        </div>
        
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{selectedStock.name}</h2>
              <p className="text-sm text-muted-foreground">{selectedStock.sector}</p>
            </div>
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
