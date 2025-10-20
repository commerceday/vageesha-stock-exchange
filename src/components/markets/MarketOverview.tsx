
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, GlobeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketIndex, formatPercentage } from '@/utils/stocksApi';

interface MarketOverviewProps {
  indices: MarketIndex[];
  className?: string;
  horizontal?: boolean;
}

export function MarketOverview({ indices, className, horizontal = false }: MarketOverviewProps) {
  const groupedByRegion = indices.reduce<Record<string, MarketIndex[]>>((acc, index) => {
    if (!acc[index.region]) {
      acc[index.region] = [];
    }
    acc[index.region].push(index);
    return acc;
  }, {});
  
  const renderMarketContent = () => (
    <>
      {Object.entries(groupedByRegion).map(([region, indices]) => (
        <div key={region} className={horizontal ? "px-4 flex-shrink-0" : "p-4"}>
          <h3 className="text-sm font-medium mb-2">{region}</h3>
          <div className={horizontal ? "flex gap-4" : "space-y-2"}>
            {indices.map((index) => (
              <div 
                key={index.symbol}
                className={cn(
                  "flex items-center justify-between",
                  horizontal ? "flex-col gap-1 min-w-[140px] p-2 rounded-lg bg-card border" : "py-1 border-b border-border/50 last:border-0"
                )}
              >
                <div className={cn("flex flex-col", horizontal ? "items-center" : "")}>
                  <span className="font-medium text-sm">{index.name}</span>
                  <span className="text-xs text-muted-foreground">{index.symbol}</span>
                </div>
                <div className={cn("flex flex-col", horizontal ? "items-center" : "items-end")}>
                  <span className="font-medium text-sm">{index.value.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}</span>
                  <span className={cn(
                    "flex items-center text-xs",
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
  
  if (horizontal) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <GlobeIcon className="h-5 w-5 mr-2" />
            Global Markets
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll-horizontal hover:[animation-play-state:paused]">
              {renderMarketContent()}
              {renderMarketContent()}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <GlobeIcon className="h-5 w-5 mr-2" />
          Global Markets
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[400px] overflow-hidden">
          <div className="absolute inset-0 animate-scroll-markets hover:[animation-play-state:paused]">
            <div className="grid gap-0.5">
              {renderMarketContent()}
              {renderMarketContent()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
