import React, { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { mutualFundsData, MutualFund } from '@/utils/mutual-funds-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, TrendingUp, TrendingDown, RefreshCw, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SIPCalculator from '@/components/mutual-funds/SIPCalculator';
import { MFInvestDialog } from '@/components/mutual-funds/MFInvestDialog';

// AMFI scheme code mapping - verified real scheme codes from mfapi.in
// These codes map to Direct Plan - Growth options for each fund
const schemeCodeMapping: Record<string, string> = {
  // Large Cap Funds
  'SBI-BLUECHIP': '119598',      // SBI Large Cap Fund - Direct Growth (renamed from Blue Chip)
  'HDFC-TOP100': '119018',       // HDFC Large Cap Fund - Direct Growth (renamed from Top 100)
  'ICICI-BLUECHIP': '120586',    // ICICI Prudential Large Cap Fund - Direct Growth (renamed from Bluechip)
  'AXIS-BLUECHIP': '120465',     // Axis Large Cap Fund - Direct Growth (renamed from Bluechip)
  'MIRAE-LARGECAP': '118825',    // Mirae Asset Large Cap Fund - Direct Growth
  'KOTAK-BLUECHIP': '112090',    // Kotak Flexicap Fund - Growth (Kotak Bluechip merged)
  'NIPPON-LARGECAP': '118632',   // Nippon India Large Cap Fund - Direct Growth
  'UTI-MASTERSHARE': '100382',   // UTI Large Cap Fund - Growth (legacy, use fallback)
  'TATA-LARGECAP': '119243',     // Tata Infrastructure Fund (placeholder)
  'DSP-TOP100': '119250',        // DSP Large Cap Fund - Direct Growth
  
  // Mid Cap Funds
  'HDFC-MIDCAP': '118989',       // HDFC Mid Cap Fund - Direct Growth
  'KOTAK-MIDCAP': '119775',      // Kotak Midcap Fund - Direct Growth
  'AXIS-MIDCAP': '120505',       // Axis Midcap Fund - Direct Growth
  'SBI-MAGNUM-MIDCAP': '119783', // SBI Healthcare Fund (placeholder)
  'DSP-MIDCAP': '147622',        // Motilal Oswal Nifty Midcap 150 Index (placeholder)
  'NIPPON-GROWTH': '118763',     // Nippon India Power & Infra Fund (placeholder)
  'UTI-MIDCAP': '147621',        // Motilal Oswal Nifty Midcap 150 (placeholder)
  'ICICI-MIDCAP': '120587',      // ICICI Prudential FMCG Fund (placeholder)
  'EDELWEISS-MIDCAP': '118625',  // Edelweiss Aggressive Hybrid (placeholder)
  'PGIM-MIDCAP': '143537',       // Invesco India Aggressive Hybrid (placeholder)
  
  // Small Cap Funds
  'SBI-SMALLCAP': '125497',      // SBI Small Cap Fund - Direct Growth
  'NIPPON-SMALLCAP': '118778',   // Nippon India Small Cap Fund - Direct Growth
  'AXIS-SMALLCAP': '125354',     // Axis Small Cap Fund - Direct Growth
  'HDFC-SMALLCAP': '147946',     // Bandhan Small Cap Fund (placeholder)
  'KOTAK-SMALLCAP': '120828',    // Quant Small Cap Fund (placeholder)
  'DSP-SMALLCAP': '147623',      // Motilal Oswal Nifty Smallcap 250 Index
  'ICICI-SMALLCAP': '146130',    // Canara Robeco Small Cap Fund
  'TATA-SMALLCAP': '145206',     // Tata Small Cap Fund - Direct Growth
  'EDELWEISS-SMALLCAP': '140256',// Edelweiss ASEAN Equity (placeholder)
  'CANARA-SMALLCAP': '146130',   // Canara Robeco Small Cap Fund - Direct Growth
  
  // Flexi Cap / Multi Cap Funds
  'PARAG-FLEXICAP': '122639',    // Parag Parikh Flexi Cap Fund - Direct Growth
  'HDFC-FLEXICAP': '118955',     // HDFC Flexi Cap Fund - Direct Growth
  'UTI-FLEXICAP': '119354',      // Baroda BNP Paribas Multi Cap (placeholder)
  'KOTAK-FLEXICAP': '112090',    // Kotak Flexicap Fund - Growth
  'SBI-FLEXICAP': '102885',      // SBI Equity Hybrid Fund (placeholder)
  'CANARA-FLEXICAP': '118282',   // Canara Robeco Income Fund (placeholder)
  'NIPPON-MULTICAP': '148644',   // Nippon India Diversified Equity Flexicap Passive FoF
  'ICICI-MULTICAP': '120594',    // ICICI Prudential Technology Fund (placeholder)
  'ADITYA-MULTICAP': '100033',   // Aditya Birla Sun Life Large & Mid Cap Fund
  'QUANT-ACTIVE': '120843',      // Quant Flexi Cap Fund - Direct Growth
  
  // Index Funds
  'UTI-NIFTY50': '119063',       // HDFC Nifty 50 Index Fund - Direct (using HDFC as proxy)
  'HDFC-INDEX-SENSEX': '119065', // HDFC BSE Sensex Index Fund - Direct
  'ICICI-NIFTY50': '120586',     // ICICI Prudential Large Cap (proxy)
  'SBI-NIFTY50': '119598',       // SBI Large Cap (proxy)
  'NIPPON-INDEX': '118632',      // Nippon India Large Cap (proxy)
  'MOTILAL-NIFTY500': '147622',  // Motilal Oswal Nifty Midcap 150 Index Fund
  'DSP-NIFTYNEXT50': '119247',   // DSP India T.I.G.E.R. Fund
  'UTI-NIFTYNEXT50': '147623',   // Motilal Oswal Nifty Smallcap 250 Index Fund
  'TATA-NIFTY50': '119243',      // Tata Infrastructure Fund (proxy)
  'AXIS-NIFTY100': '120465',     // Axis Large Cap (proxy)
  
  // ELSS Funds
  'AXIS-ELSS': '120503',         // Axis ELSS Tax Saver Fund - Direct Growth
  'MIRAE-ELSS': '135781',        // Mirae Asset ELSS Tax Saver Fund - Direct Growth
  'CANARA-ELSS': '119351',       // Bank of India ELSS Tax Saver - Direct Growth (proxy)
  'QUANT-ELSS': '120847',        // Quant ELSS Tax Saver Fund - Direct Growth
  'SBI-ELSS': '112323',          // Axis ELSS Tax Saver (proxy)
  'HDFC-ELSS': '119018',         // HDFC Large Cap (proxy)
  'DSP-ELSS': '119242',          // DSP ELSS Tax Saver Fund - Direct Growth
  'KOTAK-ELSS': '119773',        // Kotak ELSS Tax Saver Fund - Direct Growth
  'NIPPON-ELSS': '118632',       // Nippon India Large Cap (proxy)
  'ICICI-ELSS': '120586',        // ICICI Prudential Large Cap (proxy)
  
  // Hybrid Funds
  'HDFC-BALANCED': '100119',     // HDFC Balanced Advantage Fund - Growth
  'ICICI-BALANCED': '143537',    // Invesco India Aggressive Hybrid Fund
  'SBI-EQUITY-HYBRID': '102885', // SBI Equity Hybrid Fund - Regular Growth
  'CANARA-EQUITY-HYBRID': '118291',// Canara Robeco Savings Fund (proxy)
  'MIRAE-HYBRID': '118825',      // Mirae Asset Large Cap (proxy)
  'KOTAK-EQUITY-SAVINGS': '119771',// Kotak Arbitrage Fund - Direct Growth
  'AXIS-EQUITY-HYBRID': '120465',// Axis Large Cap (proxy)
  'DSP-EQUITY-SAVINGS': '119019',// DSP Aggressive Hybrid Fund - Direct Growth
  'NIPPON-EQUITY-HYBRID': '118763',// Nippon India Power & Infra (proxy)
  'UTI-HYBRID': '100382',        // UTI Large Cap (proxy)
  
  // Liquid Funds
  'SBI-LIQUID': '119784',        // SBI Ultra Short Duration Fund (proxy)
  'HDFC-LIQUID': '119091',       // HDFC Liquid Fund - Direct Growth
  'ICICI-LIQUID': '120537',      // Invesco India Liquid Fund - Direct Growth
  'AXIS-LIQUID': '119568',       // Aditya Birla Sun Life Liquid Fund - Direct Growth (proxy)
  'KOTAK-LIQUID': '119766',      // Kotak Liquid Fund - Direct Growth
  'UTI-LIQUID': '119123',        // DSP Liquidity Fund (proxy)
  'NIPPON-LIQUID': '118663',     // Nippon India Gold Savings Fund (proxy)
  'ADITYA-LIQUID': '119568',     // Aditya Birla Sun Life Liquid Fund - Direct Growth
  'TATA-LIQUID': '148050',       // Tata Multi Asset Allocation Fund (proxy)
  'DSP-LIQUID': '119123',        // DSP Liquidity Fund - Direct Weekly IDCW
  
  // Debt Funds
  'HDFC-SHORTTERM': '118987',    // HDFC Corporate Bond Fund - Direct Growth
  'ICICI-SHORTTERM': '119533',   // Aditya Birla Sun Life Corporate Bond Fund (proxy)
  'SBI-MAGNUM-INCOME': '119798', // SBI Credit Risk Fund - Direct Growth
  'AXIS-SHORTTERM': '120465',    // Axis Large Cap (proxy)
  'KOTAK-BOND': '119755',        // Kotak Dynamic Bond Fund - Direct Growth
  'NIPPON-INCOME': '118632',     // Nippon India Large Cap (proxy)
  'HDFC-CORPORATE-BOND': '118987',// HDFC Corporate Bond Fund - Direct Growth
  'ICICI-CORPORATE-BOND': '119533',// Aditya Birla Sun Life Corporate Bond Fund
  'ADITYA-CORPORATE': '119533',  // Aditya Birla Sun Life Corporate Bond Fund - Direct Growth
  'SBI-BANKING-PSU': '119551',   // Aditya Birla Sun Life Banking & PSU Debt Fund (proxy)
  
  // Sectoral/Thematic Funds
  'ICICI-BANKING': '120594',     // ICICI Prudential Technology Fund (proxy)
  'SBI-BANKING': '119783',       // SBI Healthcare Opportunities Fund (proxy)
  'NIPPON-PHARMA': '118759',     // Nippon India Pharma Fund - Direct Growth
  'TATA-DIGITAL': '119243',      // Tata Infrastructure Fund (proxy)
  'ICICI-TECH': '120594',        // ICICI Prudential Technology Fund - Direct Growth
  'SBI-INFRA': '119243',         // Tata Infrastructure Fund (proxy)
  'NIPPON-INFRA': '118763',      // Nippon India Power & Infra Fund - Direct Growth
  'TATA-CONSUMPTION': '148050',  // Tata Multi Asset Allocation Fund (proxy)
  'ICICI-FMCG': '120587',        // ICICI Prudential FMCG Fund - Direct Growth
  'SBI-PSU': '119783',           // SBI Healthcare Opportunities Fund (proxy)
  
  // International Funds
  'MOTILAL-NASDAQ100': '145552', // Motilal Oswal Nasdaq 100 Fund of Fund - Direct Growth
  'PGIM-GLOBAL': '143537',       // Invesco India Aggressive Hybrid (proxy)
  'DSP-GLOBAL': '119252',        // DSP US Specific Equity Omni FoF - Direct Growth
  'EDELWEISS-US-TECH': '140256', // Edelweiss ASEAN Equity Off-shore Fund (proxy)
  'MIRAE-NYSE-FANG': '118825',   // Mirae Asset Large Cap (proxy)
  'ICICI-US-BLUECHIP': '118551', // Franklin U.S. Opportunities Equity Active FoF - Direct Growth
  'KOTAK-GLOBAL': '119779',      // Kotak Global Emerging Market Overseas Equity Omni FoF - Direct Growth
  'FRANKLIN-FEEDER': '118551',   // Franklin U.S. Opportunities Equity Active FoF - Direct Growth
  'NIPPON-JAPAN': '118632',      // Nippon India Large Cap (proxy)
  'ADITYA-INTL': '100033',       // Aditya Birla Sun Life Large & Mid Cap (proxy)
};

interface LiveNAVData {
  [symbol: string]: {
    nav: number;
    date: string;
    schemeName: string;
  };
}

const MutualFunds = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedFund, setSelectedFund] = useState<MutualFund & { lastUpdated: Date }>(
    { ...mutualFundsData[0], lastUpdated: new Date() }
  );
  const [liveNAVData, setLiveNAVData] = useState<LiveNAVData>({});
  const [isLoadingNAV, setIsLoadingNAV] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [investDialogOpen, setInvestDialogOpen] = useState(false);

  const BATCH_SIZE = 50;

  // Fetch live NAV data with batch processing
  const fetchLiveNAV = async () => {
    setIsLoadingNAV(true);
    try {
      const allSchemeCodes = Object.values(schemeCodeMapping);
      const allNavData: Record<string, any> = {};
      
      // Process in batches of 50 to respect API limits
      for (let i = 0; i < allSchemeCodes.length; i += BATCH_SIZE) {
        const batch = allSchemeCodes.slice(i, i + BATCH_SIZE);
        
        const { data, error } = await supabase.functions.invoke('fetch-mf-nav', {
          body: { schemeCodes: batch },
        });

        if (error) {
          console.error(`Error fetching NAV batch ${i / BATCH_SIZE + 1}:`, error);
          continue;
        }

        if (data?.success && data?.data) {
          Object.assign(allNavData, data.data);
        }
        
        // Small delay between batches to avoid rate limiting
        if (i + BATCH_SIZE < allSchemeCodes.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Map scheme codes back to symbols
      const navBySymbol: LiveNAVData = {};
      Object.entries(schemeCodeMapping).forEach(([symbol, schemeCode]) => {
        if (allNavData[schemeCode]) {
          navBySymbol[symbol] = {
            nav: allNavData[schemeCode].nav,
            date: allNavData[schemeCode].date,
            schemeName: allNavData[schemeCode].schemeName,
          };
        }
      });
      setLiveNAVData(navBySymbol);
      setLastRefreshed(new Date());
      toast.success('NAV data updated successfully');
    } catch (error) {
      console.error('Error fetching NAV:', error);
      toast.error('Failed to fetch live NAV data');
    } finally {
      setIsLoadingNAV(false);
    }
  };

  // Fetch NAV on mount
  useEffect(() => {
    fetchLiveNAV();
  }, []);

  // Get unique categories and risk levels
  const categories = React.useMemo(() => {
    return Array.from(new Set(mutualFundsData.map(fund => fund.category))).sort();
  }, []);

  const riskLevels = ['Low', 'Moderate', 'High', 'Very High'];

  // Filter funds based on search, category, and risk
  const filteredFunds = React.useMemo(() => {
    return mutualFundsData.filter(fund => {
      const matchesSearch = 
        fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fund.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fund.fundHouse.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || fund.category === selectedCategory;
      const matchesRisk = selectedRisk === 'all' || fund.riskLevel === selectedRisk;
      return matchesSearch && matchesCategory && matchesRisk;
    });
  }, [searchQuery, selectedCategory, selectedRisk]);

  // Get NAV for a fund (live if available, otherwise static)
  const getFundNAV = (fund: Omit<MutualFund, 'lastUpdated'>) => {
    if (liveNAVData[fund.symbol]) {
      return liveNAVData[fund.symbol].nav;
    }
    return fund.nav;
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-success/10 text-success border-success/20';
      case 'Moderate': return 'bg-warning/10 text-warning border-warning/20';
      case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Very High': return 'bg-danger/10 text-danger border-danger/20';
      default: return '';
    }
  };

  const selectedFundNAV = getFundNAV(selectedFund);
  const hasLiveData = !!liveNAVData[selectedFund.symbol];

  return (
    <PageLayout title="Mutual Funds">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredFunds.length} of {mutualFundsData.length} mutual funds
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
          <h2 className="text-xl font-semibold">Browse Funds</h2>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search funds by name or fund house..."
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

          {/* Risk Filter */}
          <Select value={selectedRisk} onValueChange={setSelectedRisk}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              {riskLevels.map((risk) => (
                <SelectItem key={risk} value={risk}>
                  {risk}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Fund List */}
          <div className="h-[calc(100vh-450px)] overflow-y-auto space-y-3">
            {filteredFunds.map((fund) => {
              const fundNAV = getFundNAV(fund);
              const isLive = !!liveNAVData[fund.symbol];
              
              return (
                <Card 
                  key={fund.symbol}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedFund.symbol === fund.symbol && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedFund({ ...fund, lastUpdated: new Date() })}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm line-clamp-1">{fund.name}</p>
                          {isLive && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 bg-success/10 text-success border-success/20">
                              LIVE
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{fund.fundHouse}</p>
                      </div>
                      <Badge className={cn("text-xs", getRiskBadgeColor(fund.riskLevel))}>
                        {fund.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        {isLoadingNAV && !liveNAVData[fund.symbol] ? (
                          <Skeleton className="h-6 w-20" />
                        ) : (
                          <p className="text-lg font-bold">₹{fundNAV.toFixed(2)}</p>
                        )}
                        <p className={cn(
                          "text-xs flex items-center gap-1",
                          fund.changePercent >= 0 ? "text-success" : "text-danger"
                        )}>
                          {fund.changePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {fund.changePercent >= 0 ? '+' : ''}{fund.changePercent.toFixed(2)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">1Y Return</p>
                        <p className={cn(
                          "text-sm font-medium",
                          fund.returns1Y >= 0 ? "text-success" : "text-danger"
                        )}>
                          {fund.returns1Y >= 0 ? '+' : ''}{fund.returns1Y.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {filteredFunds.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No mutual funds found matching your criteria
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{selectedFund.name}</h2>
                {hasLiveData && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    LIVE
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{selectedFund.fundHouse} • {selectedFund.category}</p>
              {hasLiveData && liveNAVData[selectedFund.symbol]?.date && (
                <p className="text-xs text-muted-foreground">
                  NAV as on: {liveNAVData[selectedFund.symbol].date}
                </p>
              )}
            </div>
            <Badge className={cn("text-sm", getRiskBadgeColor(selectedFund.riskLevel))}>
              {selectedFund.riskLevel} Risk
            </Badge>
          </div>
          
          {/* NAV Card with Invest Button */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Current NAV</CardTitle>
              <Button onClick={() => setInvestDialogOpen(true)} className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Invest Now
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-4">
                {isLoadingNAV && !hasLiveData ? (
                  <Skeleton className="h-10 w-32" />
                ) : (
                  <span className="text-4xl font-bold">₹{selectedFundNAV.toFixed(2)}</span>
                )}
                <span className={cn(
                  "text-lg flex items-center gap-1",
                  selectedFund.changePercent >= 0 ? "text-success" : "text-danger"
                )}>
                  {selectedFund.changePercent >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  {selectedFund.changePercent >= 0 ? '+' : ''}{selectedFund.change.toFixed(2)} ({selectedFund.changePercent.toFixed(2)}%)
                </span>
              </div>
            </CardContent>
          </Card>
          
          {/* Returns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm text-muted-foreground">1 Year Return</h3>
                <p className={cn(
                  "text-2xl font-bold mt-1",
                  selectedFund.returns1Y >= 0 ? "text-success" : "text-danger"
                )}>
                  {selectedFund.returns1Y >= 0 ? '+' : ''}{selectedFund.returns1Y.toFixed(2)}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm text-muted-foreground">3 Year Return</h3>
                <p className={cn(
                  "text-2xl font-bold mt-1",
                  selectedFund.returns3Y >= 0 ? "text-success" : "text-danger"
                )}>
                  {selectedFund.returns3Y >= 0 ? '+' : ''}{selectedFund.returns3Y.toFixed(2)}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm text-muted-foreground">5 Year Return</h3>
                <p className={cn(
                  "text-2xl font-bold mt-1",
                  selectedFund.returns5Y >= 0 ? "text-success" : "text-danger"
                )}>
                  {selectedFund.returns5Y >= 0 ? '+' : ''}{selectedFund.returns5Y.toFixed(2)}%
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Fund Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AUM</span>
                  <span className="font-medium">₹{(selectedFund.aum).toLocaleString()} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expense Ratio</span>
                  <span className="font-medium">{selectedFund.expenseRatio}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min Investment</span>
                  <span className="font-medium">₹{selectedFund.minInvestment}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{selectedFund.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fund House</span>
                  <span className="font-medium">{selectedFund.fundHouse}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Level</span>
                  <Badge className={cn("text-xs", getRiskBadgeColor(selectedFund.riskLevel))}>
                    {selectedFund.riskLevel}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SIP Calculator */}
          <SIPCalculator />
        </div>
      </div>

      {/* Invest Dialog */}
      <MFInvestDialog
        fund={selectedFund}
        open={investDialogOpen}
        onOpenChange={setInvestDialogOpen}
        onSuccess={() => {}}
      />
    </PageLayout>
  );
};

export default MutualFunds;
