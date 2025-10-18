
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { generatePriceHistory } from '@/utils/stocksApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const timeRanges = [
  { label: '1D', days: 1, interval: 24 },
  { label: '1W', days: 7, interval: 7 },
  { label: '1M', days: 30, interval: 30 },
  { label: '3M', days: 90, interval: 30 },
  { label: '1Y', days: 365, interval: 52 },
  { label: 'All', days: 1825, interval: 104 },
];

interface StockChartProps {
  symbol: string;
  name: string;
  currentPrice: number;
  volatility?: number;
  className?: string;
}

export function StockChart({ 
  symbol, 
  name,
  currentPrice,
  volatility = 2,
  className
}: StockChartProps) {
  const [selectedRange, setSelectedRange] = useState(timeRanges[2]); // Default to 1M
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  
  const chartData = useMemo(() => {
    const prices = generatePriceHistory(selectedRange.days, currentPrice, volatility);
    const data = [];
    
    // Calculate dates going backward from today
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    
    for (let i = 0; i < prices.length; i++) {
      const date = new Date(now.getTime() - (selectedRange.days - i) * msPerDay);
      const basePrice = prices[i];
      
      // Generate OHLC data for candlestick
      const open = basePrice * (1 + (Math.random() - 0.5) * 0.02);
      const close = basePrice * (1 + (Math.random() - 0.5) * 0.02);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      
      data.push({
        time: Math.floor(date.getTime() / 1000) as any,
        open,
        high,
        low,
        close,
      });
    }
    
    return data;
  }, [selectedRange, currentPrice, volatility]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'hsl(var(--foreground))',
      },
      grid: {
        vertLines: { color: 'hsl(var(--border))' },
        horzLines: { color: 'hsl(var(--border))' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: 'hsl(142, 76%, 36%)',
      downColor: 'hsl(0, 84%, 60%)',
      borderVisible: false,
      wickUpColor: 'hsl(142, 76%, 36%)',
      wickDownColor: 'hsl(0, 84%, 60%)',
    });

    candlestickSeriesRef.current = candlestickSeries;
    candlestickSeries.setData(chartData);

    chart.timeScale().fitContent();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (candlestickSeriesRef.current) {
      candlestickSeriesRef.current.setData(chartData);
      chartRef.current?.timeScale().fitContent();
    }
  }, [chartData]);
  
  return (
    <Card className={cn("overflow-hidden h-full", className)}>
      <CardHeader className="flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="leading-none">{symbol}</CardTitle>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
        <div className="flex gap-1">
          {timeRanges.map((range) => (
            <Button 
              key={range.label} 
              variant={selectedRange.label === range.label ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedRange(range)}
              className="h-7 px-2 text-xs"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        <div ref={chartContainerRef} className="h-[300px] w-full px-4" />
      </CardContent>
    </Card>
  );
}
