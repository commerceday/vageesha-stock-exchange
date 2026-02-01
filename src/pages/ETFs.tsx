import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { etfData, ETF } from '@/utils/etf-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, TrendingUp, TrendingDown, ArrowUpDown, ShoppingCart, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ETFBuySellDialog } from '@/components/etfs/ETFBuySellDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// AMFI scheme code mapping for ETFs - verified real scheme codes from mfapi.in
const etfSchemeCodeMapping: Record<string, string> = {
  'NIFTYBEES': '120716',         // Nippon India ETF Nifty BeES
  'SETFNIF50': '136794',         // SBI-ETF Nifty 50
  'ICICINIF50': '120323',        // ICICI Prudential Nifty 50 ETF
  'BANKBEES': '118836',          // Nippon India ETF Bank BeES
  'JUNIORBEES': '120713',        // Nippon India ETF Nifty Next 50 Junior BeES
  'GOLDBEES': '107574',          // Nippon India ETF Gold BeES
  'ITBEES': '120712',            // Nippon India ETF Nifty IT
  'PSUBNKBEES': '140555',        // Nippon India ETF PSU Bank BeES
  'INFRABEES': '120711',         // Nippon India ETF Infra BeES
  'SILVERBEES': '147830',        // Nippon India Silver ETF
  'N100': '140524',              // Motilal Oswal Nasdaq 100 ETF
  'CPSE': '136714',              // Nippon India ETF CPSE
  'SETFNIFBK': '136797',         // SBI-ETF Nifty Bank
  'SENSEXBEES': '120715',        // Nippon India ETF Sensex
};

interface LiveNAVData {
  [symbol: string]: {
    nav: number;
    date: string;
    schemeName: string;
  };
}

const ETFs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFundHouse, setSelectedFundHouse] = useState<string>('all');
  const [selectedETF, setSelectedETF] = useState<ETF & { lastUpdated: Date }>(
    { ...etfData[0], lastUpdated: new Date() }
  );
  const [buySellDialogOpen, setBuySellDialogOpen] = useState(false);
  const [liveNAVData, setLiveNAVData] = useState<LiveNAVData>({});
  const [isLoadingNAV, setIsLoadingNAV] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Fetch live NAV data
  const fetchLiveNAV = async () => {
    setIsLoadingNAV(true);
    try {
      const schemeCodes = Object.values(etfSchemeCodeMapping);
      
      const { data, error } = await supabase.functions.invoke('fetch-mf-nav', {
        body: { schemeCodes },
      });

      if (error) throw error;

      if (data?.success && data?.data) {
        // Map scheme codes back to symbols
        const navBySymbol: LiveNAVData = {};
        Object.entries(etfSchemeCodeMapping).forEach(([symbol, schemeCode]) => {
          if (data.data[schemeCode]) {
            navBySymbol[symbol] = {
              nav: data.data[schemeCode].nav,
              date: data.data[schemeCode].date,
              schemeName: data.data[schemeCode].schemeName,
            };
          }
        });
        setLiveNAVData(navBySymbol);
        setLastRefreshed(new Date());
        toast.success('ETF NAV data updated successfully');
      }
    } catch (error) {
      console.error('Error fetching ETF NAV:', error);
      toast.error('Failed to fetch live ETF NAV data');
    } finally {
      setIsLoadingNAV(false);
    }
  };

  // Fetch NAV on mount
  useEffect(() => {
    fetchLiveNAV();
  }, []);

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

  // Get NAV for an ETF (live if available, otherwise static)
  const getETFNAV = (etf: Omit<ETF, 'lastUpdated'>) => {
    if (liveNAVData[etf.symbol]) {
      return liveNAVData[etf.symbol].nav;
    }
    return etf.nav;
  };

  const getPremiumDiscountColor = (value: number) => {
    if (value > 0.5) return 'text-danger';
    if (value < -0.5) return 'text-success';
    return 'text-muted-foreground';
  };

  const selectedETFNAV = getETFNAV(selectedETF);
  const hasLiveData = !!liveNAVData[selectedETF.symbol];

  return (
    <PageLayout title="Exchange Traded Funds (ETFs)">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredETFs.length} of {etfData.length} ETFs
        </p>
        <div className="flex items-center gap-2">
          {lastRefreshed && (
            <span className="text-xs text-muted-foreground">
              Last updated: {lastRefreshed.toLocaleTimeString()}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLiveNAV}
            disabled={isLoadingNAV}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoadingNAV && "animate-spin")} />
            Refresh NAV
          </Button>
        </div>
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
            {filteredETFs.map((etf) => {
              const etfNAV = getETFNAV(etf);
              const isLive = !!liveNAVData[etf.symbol];
              
              return (
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
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{etf.symbol}</p>
                          {isLive && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 bg-success/10 text-success border-success/20">
                              LIVE
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{etf.name}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {etf.category}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        {isLoadingNAV && !liveNAVData[etf.symbol] ? (
                          <Skeleton className="h-6 w-20" />
                        ) : (
                          <p className="text-lg font-bold">₹{etf.price.toFixed(2)}</p>
                        )}
                        <p className={cn(
                          "text-xs flex items-center gap-1",
                          etf.changePercent >= 0 ? "text-success" : "text-danger"
                        )}>
                          {etf.changePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {etf.changePercent >= 0 ? '+' : ''}{etf.changePercent.toFixed(2)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">NAV</p>
                        <p className="text-sm font-medium">₹{etfNAV.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{selectedETF.symbol}</h2>
                {hasLiveData && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    LIVE
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{selectedETF.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tracks: <span className="font-medium">{selectedETF.trackingIndex}</span>
              </p>
              {hasLiveData && liveNAVData[selectedETF.symbol]?.date && (
                <p className="text-xs text-muted-foreground">
                  NAV as on: {liveNAVData[selectedETF.symbol].date}
                </p>
              )}
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
                {isLoadingNAV && !hasLiveData ? (
                  <Skeleton className="h-7 w-20 mt-1" />
                ) : (
                  <p className="text-xl font-bold mt-1">₹{selectedETFNAV.toFixed(2)}</p>
                )}
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
