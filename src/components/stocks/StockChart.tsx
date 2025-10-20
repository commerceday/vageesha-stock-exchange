
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { generateIntradayData, generateDailyCandlestickData } from '@/utils/stocksApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const timeRanges = [
  { label: '1D', type: 'intraday', intervalMinutes: 5, periods: 75, isIntraday: true }, // 5-min candles for 6.25 hours
  { label: '5D', type: 'intraday', intervalMinutes: 15, periods: 120, isIntraday: true }, // 15-min candles for 5 days
  { label: '1M', type: 'daily', days: 30, isIntraday: false },
  { label: '3M', type: 'daily', days: 90, isIntraday: false },
  { label: '6M', type: 'daily', days: 180, isIntraday: false },
  { label: '1Y', type: 'daily', days: 365, isIntraday: false },
  { label: 'All', type: 'daily', days: 1825, isIntraday: false },
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
  const [serverData, setServerData] = useState<any[]>([]);
  
  const chartData = useMemo(() => {
    if (selectedRange.isIntraday && 'intervalMinutes' in selectedRange && 'periods' in selectedRange) {
      // Generate intraday candlestick data
      return generateIntradayData(
        selectedRange.intervalMinutes,
        selectedRange.periods,
        currentPrice,
        volatility
      );
    } else if ('days' in selectedRange) {
      // Generate daily candlestick data
      return generateDailyCandlestickData(
        selectedRange.days,
        currentPrice,
        volatility
      );
    }
    return [];
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
        borderColor: 'hsl(var(--border))',
      },
      rightPriceScale: {
        borderColor: 'hsl(var(--border))',
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

  // Fallback: use simulated data if no server data yet
  useEffect(() => {
    if (!serverData.length && candlestickSeriesRef.current) {
      candlestickSeriesRef.current.setData(chartData);
      chartRef.current?.timeScale().fitContent();
    }
  }, [chartData, serverData.length]);

  // Apply server data when available
  useEffect(() => {
    if (serverData.length && candlestickSeriesRef.current) {
      candlestickSeriesRef.current.setData(serverData);
      chartRef.current?.timeScale().fitContent();
    }
  }, [serverData]);

  // Fetch real OHLC data for the selected symbol and range
  useEffect(() => {
    let isCancelled = false;

    const mapToYahoo = () => {
      switch (selectedRange.label) {
        case '1D':
          return { range: '1d', interval: '5m' };
        case '5D':
          return { range: '5d', interval: '15m' };
        case '1M':
          return { range: '1mo', interval: '1d' };
        case '3M':
          return { range: '3mo', interval: '1d' };
        case '6M':
          return { range: '6mo', interval: '1d' };
        case '1Y':
          return { range: '1y', interval: '1d' };
        case 'All':
          return { range: '5y', interval: '1d' };
        default:
          return { range: '1mo', interval: '1d' };
      }
    };

    const { range, interval } = mapToYahoo();

    setServerData([]); // clear to show fallback while loading

    supabase.functions
      .invoke('fetch-stock-history', {
        body: { symbol, range, interval },
      })
      .then((res) => {
        if (isCancelled) return;
        const candles = (res.data as any)?.candles ?? [];
        if (Array.isArray(candles) && candles.length) {
          setServerData(candles);
        } else {
          setServerData([]);
        }
      })
      .catch((err) => {
        console.error('fetch-stock-history error', err);
        if (!isCancelled) setServerData([]);
      });

    return () => {
      isCancelled = true;
    };
  }, [symbol, selectedRange]);
  
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
