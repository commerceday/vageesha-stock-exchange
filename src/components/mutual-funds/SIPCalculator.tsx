import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calculator, TrendingUp, IndianRupee, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SIPResult {
  totalInvested: number;
  futureValue: number;
  wealthGained: number;
}

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(10);

  const calculateSIP = useMemo((): SIPResult => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    
    // SIP Future Value Formula: P × ({[1 + r]^n – 1} / r) × (1 + r)
    const futureValue = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
      (1 + monthlyRate);
    
    const totalInvested = monthlyInvestment * months;
    const wealthGained = futureValue - totalInvested;
    
    return {
      totalInvested: Math.round(totalInvested),
      futureValue: Math.round(futureValue),
      wealthGained: Math.round(wealthGained),
    };
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const formatCurrency = (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Calculate percentage for the donut chart
  const investedPercentage = (calculateSIP.totalInvested / calculateSIP.futureValue) * 100;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          SIP Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Investment */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              Monthly Investment
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Math.max(500, Number(e.target.value)))}
                className="w-32 pl-7 text-right"
                min={500}
                max={1000000}
              />
            </div>
          </div>
          <Slider
            value={[monthlyInvestment]}
            onValueChange={(value) => setMonthlyInvestment(value[0])}
            min={500}
            max={100000}
            step={500}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹500</span>
            <span>₹1,00,000</span>
          </div>
        </div>

        {/* Expected Return Rate */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Expected Return (p.a.)
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Math.min(30, Math.max(1, Number(e.target.value))))}
                className="w-20 text-right pr-7"
                min={1}
                max={30}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
            </div>
          </div>
          <Slider
            value={[expectedReturn]}
            onValueChange={(value) => setExpectedReturn(value[0])}
            min={1}
            max={30}
            step={0.5}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1%</span>
            <span>30%</span>
          </div>
        </div>

        {/* Time Period */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Time Period
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Math.min(40, Math.max(1, Number(e.target.value))))}
                className="w-24 text-right pr-10"
                min={1}
                max={40}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">Yrs</span>
            </div>
          </div>
          <Slider
            value={[timePeriod]}
            onValueChange={(value) => setTimePeriod(value[0])}
            min={1}
            max={40}
            step={1}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 Year</span>
            <span>40 Years</span>
          </div>
        </div>

        {/* Results */}
        <div className="pt-4 border-t space-y-4">
          {/* Visual Chart */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeDasharray={`${investedPercentage} ${100 - investedPercentage}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-muted-foreground">Future Value</span>
                <span className="text-sm font-bold">{formatCurrency(calculateSIP.futureValue)}</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Invested</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted" />
              <span>Returns</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Invested Amount</p>
              <p className="font-semibold text-sm">{formatCurrency(calculateSIP.totalInvested)}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Est. Returns</p>
              <p className="font-semibold text-sm text-success">{formatCurrency(calculateSIP.wealthGained)}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <p className="text-xs text-muted-foreground mb-1">Total Value</p>
              <p className="font-semibold text-sm text-primary">{formatCurrency(calculateSIP.futureValue)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SIPCalculator;
