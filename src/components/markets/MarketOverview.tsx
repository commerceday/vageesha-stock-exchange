
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, GlobeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketIndex, formatPercentage } from '@/utils/stocksApi';

interface MarketOverviewProps {
  indices: MarketIndex[];
  className?: string;
}

export function MarketOverview({ indices, className }: MarketOverviewProps) {
  // Sort regions in desired order: India, United States, United Kingdom, Japan
  const regionOrder = ['India', 'United States', 'United Kingdom', 'Japan'];
  
  const groupedByRegion = indices.reduce<Record<string, MarketIndex[]>>((acc, index) => {
    if (!acc[index.region]) {
      acc[index.region] = [];
    }
    acc[index.region].push(index);
    return acc;
  }, {});
  
  // Sort the grouped regions by the desired order
  const sortedRegions = regionOrder
    .filter(region => groupedByRegion[region])
    .map(region => [region, groupedByRegion[region]] as [string, MarketIndex[]]);
  
  const renderMarketContent = () => (
    <>
      {sortedRegions.map(([region, indices]) => (
        <div key={region} className="p-4 border-b border-border/30 last:border-0">
          <h3 className="text-sm font-semibold mb-3 text-primary">{region}</h3>
          <div className="space-y-2.5">
            {indices.map((index) => (
              <div 
                key={index.symbol}
                className="flex items-center justify-between py-1.5"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{index.name}</span>
                  <span className="text-xs text-muted-foreground">{index.symbol}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-medium text-sm">{index.value.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}</span>
                  <span className={cn(
                    "flex items-center text-xs font-medium",
                    index.change >= 0 ? "text-success" : "text-danger"
                  )}>
                    {index.change >= 0 ? 
                      <ArrowUpIcon className="h-3 w-3 mr-1" /> : 
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    }
                    {formatPercentage(index.changePercent)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <GlobeIcon className="h-5 w-5 mr-2" />
          Global Markets
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[500px] overflow-hidden">
          <div className="absolute inset-0 animate-scroll-markets hover:[animation-play-state:paused]">
            <div className="space-y-0">
              {renderMarketContent()}
              {renderMarketContent()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
