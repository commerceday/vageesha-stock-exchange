import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { StockCard } from './StockCard';
import { Stock } from '@/utils/stocksApi';

interface VirtualizedStockListProps {
  stocks: Stock[];
  priceHistory: Map<string, number[]>;
  selectedStock: Stock;
  onStockClick: (stock: Stock) => void;
}

export function VirtualizedStockList({ 
  stocks, 
  priceHistory, 
  selectedStock, 
  onStockClick 
}: VirtualizedStockListProps) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: stocks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180,
    overscan: 5,
  });

  if (stocks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No stocks found matching your criteria
      </div>
    );
  }

  return (
    <div ref={parentRef} className="h-[calc(100vh-400px)] overflow-y-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const stock = stocks[virtualItem.index];
          return (
            <div
              key={stock.symbol}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div className="pb-4">
                <StockCard
                  stock={stock}
                  priceHistory={priceHistory.get(stock.symbol) || []}
                  onClick={() => onStockClick(stock)}
                  className={selectedStock.symbol === stock.symbol ? "ring-2 ring-primary" : ""}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
