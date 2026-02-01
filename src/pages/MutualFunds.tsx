import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { mutualFundsData, MutualFund } from '@/utils/mutual-funds-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';

const MutualFunds = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedRisk, setSelectedRisk] = React.useState<string>('all');
  const [selectedFund, setSelectedFund] = React.useState<MutualFund & { lastUpdated: Date }>(
    { ...mutualFundsData[0], lastUpdated: new Date() }
  );

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

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-success/10 text-success border-success/20';
      case 'Moderate': return 'bg-warning/10 text-warning border-warning/20';
      case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Very High': return 'bg-danger/10 text-danger border-danger/20';
      default: return '';
    }
  };

  return (
    <PageLayout title="Mutual Funds">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredFunds.length} of {mutualFundsData.length} mutual funds
        </p>
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
            {filteredFunds.map((fund) => (
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
                      <p className="font-semibold text-sm line-clamp-1">{fund.name}</p>
                      <p className="text-xs text-muted-foreground">{fund.fundHouse}</p>
                    </div>
                    <Badge className={cn("text-xs", getRiskBadgeColor(fund.riskLevel))}>
                      {fund.riskLevel}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold">₹{fund.nav.toFixed(2)}</p>
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
            ))}
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
              <h2 className="text-2xl font-bold">{selectedFund.name}</h2>
              <p className="text-sm text-muted-foreground">{selectedFund.fundHouse} • {selectedFund.category}</p>
            </div>
            <Badge className={cn("text-sm", getRiskBadgeColor(selectedFund.riskLevel))}>
              {selectedFund.riskLevel} Risk
            </Badge>
          </div>
          
          {/* NAV Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current NAV</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold">₹{selectedFund.nav.toFixed(2)}</span>
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
        </div>
      </div>
    </PageLayout>
  );
};

export default MutualFunds;
