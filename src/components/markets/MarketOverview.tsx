
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
        <div key={region} className="p-4">
          <h3 className="text-sm font-medium mb-2">{region}</h3>
          <div className="space-y-2">
            {indices.map((index) => (
              <div 
                key={index.symbol}
                className="flex items-center justify-between py-1 border-b border-border/50 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{index.name}</span>
                  <span className="text-xs text-muted-foreground">{index.symbol}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-medium">{index.value.toLocaleString(undefined, { 
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
  
  const renderHorizontalItem = (index: MarketIndex) => (
    <div 
      key={index.symbol}
      className="flex items-center gap-3 px-6 py-2 border-r border-border/50 last:border-0 whitespace-nowrap"
    >
      <span className="font-medium text-sm">{index.symbol}</span>
      <span className="font-semibold">{index.value.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}</span>
      <span className={cn(
        "flex items-center text-sm font-medium",
        index.change >= 0 ? "text-success" : "text-danger"
      )}>
        {index.change >= 0 ? 
          <ArrowUpIcon className="h-3 w-3 mr-1" /> : 
          <ArrowDownIcon className="h-3 w-3 mr-1" />
        }
        {formatPercentage(index.changePercent)}
      </span>
    </div>
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
            <div className="animate-scroll-horizontal hover:[animation-play-state:paused]">
              <div className="flex">
                {indices.map(renderHorizontalItem)}
                {indices.map(renderHorizontalItem)}
              </div>
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
