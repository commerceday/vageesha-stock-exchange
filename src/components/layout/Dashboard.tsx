
import React, { useState } from 'react';
import { 
  useStockData, useMarketIndices,
  mockStocks, mockIndices,
  generatePriceHistory 
} from '@/utils/stocksApi';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { StockCard } from '@/components/stocks/StockCard';
import { StockChart } from '@/components/stocks/StockChart';
import { MarketOverview } from '@/components/markets/MarketOverview';

import { StatsCard } from '@/components/ui/StatsCard';
import { BarChart3, TrendingDown, TrendingUp, Wallet2 } from 'lucide-react';

export function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedStock, setSelectedStock] = useState(mockStocks[0]);
  
  // Use our hooks to get real-time data
  const { stocks, priceHistory, isMarketOpen } = useStockData(mockStocks);
  const indices = useMarketIndices(mockIndices);
  
  // Calculate market statistics
  const gainers = stocks.filter(stock => stock.changePercent > 0);
  const losers = stocks.filter(stock => stock.changePercent < 0);
  
  const topGainer = [...stocks].sort((a, b) => b.changePercent - a.changePercent)[0];
  const topLoser = [...stocks].sort((a, b) => a.changePercent - b.changePercent)[0];
  
  const totalMarketCap = stocks.reduce((sum, stock) => sum + stock.marketCap, 0);
  const totalVolume = stocks.reduce((sum, stock) => sum + stock.volume, 0);
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        
        <main className="flex-1 transition-all duration-300 w-full">
          <div className="container max-w-full p-3 sm:p-4 lg:p-8 animate-fade-in">
            {/* Hero Header */}
            <div className="mb-8 space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
                Market Dashboard
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Real-time market data and insights at your fingertips
              </p>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 animate-slide-up" style={{ '--delay': '100ms' } as React.CSSProperties}>
              <StatsCard 
                title="Market Cap" 
                value="₹13.42T"
                trend={0.47}
                icon={<Wallet2 />}
                className="bg-primary/5"
              />
              <StatsCard 
                title="Trading Volume" 
                value="487.32M"
                description="Today's volume"
                icon={<BarChart3 />}
                className="bg-primary/5"
              />
              <StatsCard 
                title="Top Gainer" 
                value={topGainer.symbol}
                trend={topGainer.changePercent}
                trendLabel={topGainer.name}
                icon={<TrendingUp />}
                className="bg-success/5"
              />
              <StatsCard 
                title="Top Loser" 
                value={topLoser.symbol}
                trend={topLoser.changePercent}
                trendLabel={topLoser.name}
                icon={<TrendingDown />}
                className="bg-danger/5"
              />
            </div>
            
            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-7">
              {/* Left column - Stock list */}
              <div className="lg:col-span-1 space-y-4 sm:space-y-5 animate-slide-up" style={{ '--delay': '200ms' } as React.CSSProperties}>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Watchlist</h2>
                <div className="space-y-4">
                  {stocks.slice(0, 5).map((stock) => (
                    <StockCard 
                      key={stock.symbol} 
                      stock={stock} 
                      priceHistory={priceHistory.get(stock.symbol) || []}
                      onClick={() => setSelectedStock(stock)}
                      className={selectedStock.symbol === stock.symbol ? "ring-2 ring-primary" : ""}
                    />
                  ))}
                </div>
              </div>
              
              {/* Middle column - Chart */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4 animate-slide-up" style={{ '--delay': '300ms' } as React.CSSProperties}>
                <StockChart 
                  symbol={selectedStock.symbol} 
                  name={selectedStock.name} 
                  currentPrice={selectedStock.price}
                  volatility={2.5}
                />
              </div>
              
              {/* Right column - Markets */}
              <div className="lg:col-span-1 space-y-3 sm:space-y-4 animate-slide-up" style={{ '--delay': '400ms' } as React.CSSProperties}>
                <MarketOverview indices={indices} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
