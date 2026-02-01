import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { etfData, ETF } from '@/utils/etf-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, TrendingUp, TrendingDown, ArrowUpDown, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ETFBuySellDialog } from '@/components/etfs/ETFBuySellDialog';

const ETFs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFundHouse, setSelectedFundHouse] = useState<string>('all');
  const [selectedETF, setSelectedETF] = useState<ETF & { lastUpdated: Date }>(
    { ...etfData[0], lastUpdated: new Date() }
  );
  const [buySellDialogOpen, setBuySellDialogOpen] = useState(false);

  // Get unique categories and fund houses
  const categories = React.useMemo(() => {
    return Array.from(new Set(etfData.map(etf => etf.category))).sort();
  }, []);

  const fundHouses = React.useMemo(() => {
    return Array.from(new Set(etfData.map(etf => etf.fundHouse))).sort();
  }, []);

  // Filter ETFs based on search, category, and fund house
  const filteredETFs = React.useMemo(() => {
    return etfData.filter(etf => {
      const matchesSearch = 
        etf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        etf.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        etf.trackingIndex.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || etf.category === selectedCategory;
      const matchesFundHouse = selectedFundHouse === 'all' || etf.fundHouse === selectedFundHouse;
      return matchesSearch && matchesCategory && matchesFundHouse;
    });
  }, [searchQuery, selectedCategory, selectedFundHouse]);

  const getPremiumDiscountColor = (value: number) => {
    if (value > 0.5) return 'text-danger';
    if (value < -0.5) return 'text-success';
    return 'text-muted-foreground';
  };

  return (
    <PageLayout title="Exchange Traded Funds (ETFs)">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredETFs.length} of {etfData.length} ETFs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold">Browse ETFs</h2>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search ETFs by name or index..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fund House Filter */}
          <Select value={selectedFundHouse} onValueChange={setSelectedFundHouse}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by fund house" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fund Houses</SelectItem>
              {fundHouses.map((house) => (
                <SelectItem key={house} value={house}>
                  {house}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* ETF List */}
          <div className="h-[calc(100vh-450px)] overflow-y-auto space-y-3">
            {filteredETFs.map((etf) => (
              <Card 
                key={etf.symbol}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedETF.symbol === etf.symbol && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedETF({ ...etf, lastUpdated: new Date() })}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{etf.symbol}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{etf.name}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {etf.category}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold">₹{etf.price.toFixed(2)}</p>
                      <p className={cn(
                        "text-xs flex items-center gap-1",
                        etf.changePercent >= 0 ? "text-success" : "text-danger"
                      )}>
                        {etf.changePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {etf.changePercent >= 0 ? '+' : ''}{etf.changePercent.toFixed(2)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Exp Ratio</p>
                      <p className="text-sm font-medium">{etf.expenseRatio}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredETFs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No ETFs found matching your criteria
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{selectedETF.symbol}</h2>
              <p className="text-sm text-muted-foreground">{selectedETF.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tracks: <span className="font-medium">{selectedETF.trackingIndex}</span>
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {selectedETF.category}
            </Badge>
          </div>
          
          {/* Price Card with Buy Button */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Market Price</CardTitle>
              <Button onClick={() => setBuySellDialogOpen(true)} className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Buy / Sell
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold">₹{selectedETF.price.toFixed(2)}</span>
                <span className={cn(
                  "text-lg flex items-center gap-1",
                  selectedETF.changePercent >= 0 ? "text-success" : "text-danger"
                )}>
                  {selectedETF.changePercent >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  {selectedETF.changePercent >= 0 ? '+' : ''}{selectedETF.change.toFixed(2)} ({selectedETF.changePercent.toFixed(2)}%)
                </span>
              </div>
            </CardContent>
          </Card>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm text-muted-foreground">NAV</h3>
                <p className="text-xl font-bold mt-1">₹{selectedETF.nav.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm text-muted-foreground">Premium/Discount</h3>
                <p className={cn(
                  "text-xl font-bold mt-1 flex items-center gap-1",
                  getPremiumDiscountColor(selectedETF.premiumDiscount)
                )}>
                  <ArrowUpDown className="h-4 w-4" />
                  {selectedETF.premiumDiscount >= 0 ? '+' : ''}{selectedETF.premiumDiscount.toFixed(2)}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm text-muted-foreground">Expense Ratio</h3>
                <p className="text-xl font-bold mt-1">{selectedETF.expenseRatio}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm text-muted-foreground">Volume</h3>
                <p className="text-xl font-bold mt-1">
                  {(selectedETF.volume / 1000000).toFixed(2)}M
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* ETF Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fund Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fund House</span>
                  <span className="font-medium">{selectedETF.fundHouse}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracking Index</span>
                  <span className="font-medium">{selectedETF.trackingIndex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{selectedETF.category}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trading Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AUM</span>
                  <span className="font-medium">₹{selectedETF.aum.toLocaleString()} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Volume</span>
                  <span className="font-medium">{selectedETF.volume.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expense Ratio</span>
                  <span className="font-medium">{selectedETF.expenseRatio}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Note */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <ArrowUpDown className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Premium/Discount Explained</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    The premium/discount shows the difference between the ETF's market price and its NAV. 
                    A positive value means the ETF is trading at a premium, while a negative value indicates a discount. 
                    Lower values generally indicate better liquidity and tracking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Buy/Sell Dialog */}
      <ETFBuySellDialog
        etf={selectedETF}
        open={buySellDialogOpen}
        onOpenChange={setBuySellDialogOpen}
        onSuccess={() => {}}
      />
    </PageLayout>
  );
};

export default ETFs;
