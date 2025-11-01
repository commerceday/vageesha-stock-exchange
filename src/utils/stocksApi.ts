import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { nseStocksData } from './nse-stocks-data';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  lastUpdated: Date;
  dataSource?: 'real' | 'simulated' | 'error';
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  region: string;
  lastUpdated: Date;
}

export interface CurrencyPair {
  symbol: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  change: number;
  changePercent: number;
  lastUpdated: Date;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: Date;
  relatedSymbols?: string[];
}

export interface Cryptocurrency {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  supply: number;
  lastUpdated: Date;
}

export const mockStocks: Stock[] = nseStocksData.map(stock => ({
  ...stock,
  lastUpdated: new Date()
}));

export const mockIndices: MarketIndex[] = [
  {
    symbol: 'NIFTY50',
    name: 'NIFTY 50',
    value: 22147.35,
    change: 156.45,
    changePercent: 0.71,
    region: 'India',
    lastUpdated: new Date()
  },
  {
    symbol: 'SENSEX',
    name: 'BSE SENSEX',
    value: 73128.90,
    change: 428.75,
    changePercent: 0.59,
    region: 'India',
    lastUpdated: new Date()
  },
  {
    symbol: 'NIFTYBANK',
    name: 'NIFTY Bank',
    value: 48650.25,
    change: -234.80,
    changePercent: -0.48,
    region: 'India',
    lastUpdated: new Date()
  },
  {
    symbol: 'NIFTYIT',
    name: 'NIFTY IT',
    value: 35842.60,
    change: 312.45,
    changePercent: 0.88,
    region: 'India',
    lastUpdated: new Date()
  },
  {
    symbol: 'NIFTYNEXT50',
    name: 'NIFTY Next 50',
    value: 67290.15,
    change: 189.30,
    changePercent: 0.28,
    region: 'India',
    lastUpdated: new Date()
  },
  {
    symbol: 'NIFTYMIDCAP',
    name: 'NIFTY Midcap 100',
    value: 54120.80,
    change: -67.25,
    changePercent: -0.12,
    region: 'India',
    lastUpdated: new Date()
  },
  {
    symbol: 'SPX',
    name: 'S&P 500',
    value: 5618.26,
    change: 28.47,
    changePercent: 0.51,
    region: 'United States',
    lastUpdated: new Date()
  },
  {
    symbol: 'DJI',
    name: 'Dow Jones',
    value: 41250.50,
    change: -125.65,
    changePercent: -0.30,
    region: 'United States',
    lastUpdated: new Date()
  },
  {
    symbol: 'IXIC',
    name: 'NASDAQ',
    value: 17754.82,
    change: 85.28,
    changePercent: 0.48,
    region: 'United States',
    lastUpdated: new Date()
  },
  {
    symbol: 'RUT',
    name: 'Russell 2000',
    value: 2184.35,
    change: 12.45,
    changePercent: 0.57,
    region: 'United States',
    lastUpdated: new Date()
  },
  {
    symbol: 'FTSE',
    name: 'FTSE 100',
    value: 8292.66,
    change: -15.33,
    changePercent: -0.18,
    region: 'United Kingdom',
    lastUpdated: new Date()
  },
  {
    symbol: 'FTMC',
    name: 'FTSE 250',
    value: 20485.75,
    change: 48.92,
    changePercent: 0.24,
    region: 'United Kingdom',
    lastUpdated: new Date()
  },
  {
    symbol: 'N225',
    name: 'Nikkei 225',
    value: 38920.26,
    change: 145.89,
    changePercent: 0.38,
    region: 'Japan',
    lastUpdated: new Date()
  },
  {
    symbol: 'TOPX',
    name: 'TOPIX',
    value: 2748.56,
    change: -8.34,
    changePercent: -0.30,
    region: 'Japan',
    lastUpdated: new Date()
  }
];

export const mockCurrencies: CurrencyPair[] = [
  {
    symbol: 'EUR/USD',
    fromCurrency: 'EUR',
    toCurrency: 'USD',
    rate: 1.0834,
    change: 0.0023,
    changePercent: 0.21,
    lastUpdated: new Date()
  },
  {
    symbol: 'USD/JPY',
    fromCurrency: 'USD',
    toCurrency: 'JPY',
    rate: 151.59,
    change: -0.43,
    changePercent: -0.28,
    lastUpdated: new Date()
  },
  {
    symbol: 'GBP/USD',
    fromCurrency: 'GBP',
    toCurrency: 'USD',
    rate: 1.2718,
    change: 0.0035,
    changePercent: 0.28,
    lastUpdated: new Date()
  },
  {
    symbol: 'USD/CAD',
    fromCurrency: 'USD',
    toCurrency: 'CAD',
    rate: 1.3642,
    change: -0.0015,
    changePercent: -0.11,
    lastUpdated: new Date()
  },
  {
    symbol: 'USD/CHF',
    fromCurrency: 'USD',
    toCurrency: 'CHF',
    rate: 0.9037,
    change: -0.0028,
    changePercent: -0.31,
    lastUpdated: new Date()
  },
  {
    symbol: 'AUD/USD',
    fromCurrency: 'AUD',
    toCurrency: 'USD',
    rate: 0.6628,
    change: 0.0014,
    changePercent: 0.21,
    lastUpdated: new Date()
  }
];

export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'RBI Maintains Repo Rate at 6.5%, Focuses on Inflation Control',
    summary: 'The Reserve Bank of India kept the repo rate unchanged at 6.5% for the eighth consecutive time, prioritizing inflation management while supporting economic growth.',
    source: 'Economic Times',
    url: '#',
    publishedAt: new Date(Date.now() - 3600000 * 2),
    relatedSymbols: ['NIFTY50', 'SENSEX']
  },
  {
    id: '2',
    title: 'Reliance Industries Announces Major Green Energy Investments',
    summary: 'Reliance Industries unveiled plans to invest ₹75,000 crore in renewable energy projects, strengthening its commitment to achieving net-zero carbon emissions by 2035.',
    source: 'Business Standard',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1470&auto=format&fit=crop',
    publishedAt: new Date(Date.now() - 3600000 * 5),
    relatedSymbols: ['RELIANCE']
  },
  {
    id: '3',
    title: 'TCS Reports Strong Q4 Earnings, Beats Analyst Expectations',
    summary: 'Tata Consultancy Services posted robust quarterly results with revenue growth of 8.7% YoY, driven by strong demand in banking and financial services sectors.',
    source: 'Mint',
    url: '#',
    publishedAt: new Date(Date.now() - 3600000 * 8),
    relatedSymbols: ['TCS']
  },
  {
    id: '4',
    title: 'Nifty 50 Hits New All-Time High on FII Inflows',
    summary: 'Indian benchmark indices reached record highs as foreign institutional investors pumped in ₹18,000 crore, driven by positive economic indicators and corporate earnings.',
    source: 'CNBC-TV18',
    url: '#',
    publishedAt: new Date(Date.now() - 3600000 * 10),
  },
  {
    id: '5',
    title: 'HDFC Bank and ICICI Bank Lead Digital Banking Revolution',
    summary: 'Major Indian banks reported significant growth in digital transactions, with mobile banking users crossing 200 million mark as fintech adoption accelerates.',
    source: 'Money Control',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1470&auto=format&fit=crop',
    publishedAt: new Date(Date.now() - 3600000 * 12),
    relatedSymbols: ['HDFCBANK', 'ICICIBANK']
  }
];

export const mockCryptos: Cryptocurrency[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 65841.25,
    change: 1203.45,
    changePercent: 1.86,
    marketCap: 1293000000000,
    volume: 28740000000,
    supply: 19637500,
    lastUpdated: new Date()
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3487.92,
    change: 62.34,
    changePercent: 1.82,
    marketCap: 418700000000,
    volume: 14280000000,
    supply: 120100000,
    lastUpdated: new Date()
  },
  {
    symbol: 'BNB',
    name: 'Binance Coin',
    price: 567.39,
    change: -12.86,
    changePercent: -2.22,
    marketCap: 87900000000,
    volume: 2945000000,
    supply: 155000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 143.28,
    change: 8.57,
    changePercent: 6.36,
    marketCap: 61500000000,
    volume: 4720000000,
    supply: 429700000,
    lastUpdated: new Date()
  },
  {
    symbol: 'XRP',
    name: 'XRP',
    price: 0.5483,
    change: -0.0132,
    changePercent: -2.35,
    marketCap: 29700000000,
    volume: 1830000000,
    supply: 54200000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 0.1245,
    change: 0.0078,
    changePercent: 6.68,
    marketCap: 17800000000,
    volume: 2640000000,
    supply: 143200000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.4532,
    change: -0.0085,
    changePercent: -1.84,
    marketCap: 16100000000,
    volume: 492000000,
    supply: 35500000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    price: 35.27,
    change: 2.34,
    changePercent: 7.10,
    marketCap: 13300000000,
    volume: 1280000000,
    supply: 378000000,
    lastUpdated: new Date()
  }
];

export function generatePriceHistory(days: number = 30, startPrice: number = 100, volatility: number = 2): number[] {
  const prices: number[] = [startPrice];
  
  for (let i = 1; i < days; i++) {
    const change = (Math.random() - 0.5) * volatility;
    const newPrice = Math.max(prices[i-1] * (1 + change / 100), 0.1);
    prices.push(parseFloat(newPrice.toFixed(2)));
  }
  
  return prices;
}

export interface CandlestickData {
  time: any; // Using any to avoid type conflicts with lightweight-charts Time type
  open: number;
  high: number;
  low: number;
  close: number;
}

export function generateIntradayData(
  intervalMinutes: number,
  periods: number,
  currentPrice: number,
  volatility: number = 2
): CandlestickData[] {
  const data: CandlestickData[] = [];
  const now = new Date();
  
  // Generate prices working BACKWARDS from current price
  // so the most recent candle matches the current price
  const prices: number[] = [currentPrice];
  
  for (let i = 1; i < periods; i++) {
    const change = (Math.random() - 0.5) * volatility;
    const prevPrice = Math.max(prices[prices.length - 1] / (1 + change / 100), 0.1);
    prices.push(prevPrice);
  }
  
  // Reverse so oldest is first
  prices.reverse();
  
  for (let i = 0; i < periods; i++) {
    const timestamp = new Date(now.getTime() - (periods - i - 1) * intervalMinutes * 60 * 1000);
    
    const close = prices[i];
    const open = i > 0 ? prices[i - 1] : close * (1 + (Math.random() - 0.5) * (volatility / 100));
    
    // Generate intracandle movements
    const change1 = (Math.random() - 0.5) * (volatility / 2);
    const change2 = (Math.random() - 0.5) * (volatility / 2);
    
    const price1 = open * (1 + change1 / 100);
    const price2 = close * (1 + change2 / 100);
    
    const high = Math.max(open, close, price1, price2) * (1 + Math.random() * 0.003);
    const low = Math.min(open, close, price1, price2) * (1 - Math.random() * 0.003);
    
    data.push({
      time: Math.floor(timestamp.getTime() / 1000),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2))
    });
  }
  
  return data;
}

export function generateDailyCandlestickData(
  days: number,
  currentPrice: number,
  volatility: number = 2
): CandlestickData[] {
  const data: CandlestickData[] = [];
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  
  // Generate prices working BACKWARDS from current price
  // so today's close matches the current price
  const prices: number[] = [currentPrice];
  
  for (let i = 1; i < days; i++) {
    const change = (Math.random() - 0.5) * volatility;
    const prevPrice = Math.max(prices[prices.length - 1] / (1 + change / 100), 0.1);
    prices.push(prevPrice);
  }
  
  // Reverse so oldest is first
  prices.reverse();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - (days - i - 1) * msPerDay);
    
    const close = prices[i];
    const open = i > 0 ? prices[i - 1] : close * (1 + (Math.random() - 0.5) * (volatility / 100));
    
    // Generate intraday movements
    const change1 = (Math.random() - 0.5) * volatility;
    const change2 = (Math.random() - 0.5) * volatility;
    const change3 = (Math.random() - 0.5) * volatility;
    
    const price1 = open * (1 + change1 / 100);
    const price2 = close * (1 + change2 / 100);
    const price3 = close * (1 + change3 / 100);
    
    const high = Math.max(open, close, price1, price2, price3) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close, price1, price2, price3) * (1 - Math.random() * 0.01);
    
    data.push({
      time: Math.floor(date.getTime() / 1000),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2))
    });
  }
  
  return data;
}

export function formatNumber(num: number): string {
  if (num >= 1000000000000) {
    return `₹${(num / 1000000000000).toFixed(2)}T`;
  }
  if (num >= 1000000000) {
    return `₹${(num / 1000000000).toFixed(2)}B`;
  }
  if (num >= 1000000) {
    return `₹${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(2)}K`;
  }
  return `₹${num.toFixed(2)}`;
}

export function formatPercentage(num: number): string {
  return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatDate(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHour = Math.floor(diffInMin / 60);
  
  if (diffInSec < 60) {
    return 'Just now';
  } else if (diffInMin < 60) {
    return `${diffInMin}m ago`;
  } else if (diffInHour < 24) {
    return `${diffInHour}h ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

async function fetchRealTimeStockPrices(stocks: Stock[]): Promise<{ data: any[], marketOpen: boolean }> {
  try {
    const symbols = stocks.map(stock => ({
      symbol: stock.symbol,
      exchange: 'NSE' // Kept for backwards compatibility, not used by Yahoo Finance
    }));
    
    const { data, error } = await supabase.functions.invoke('fetch-stock-prices', {
      body: { symbols }
    });
    
    if (error) {
      console.error('Error fetching stock prices:', error);
      return { data: [], marketOpen: false };
    }
    
    return {
      data: data.data || [],
      marketOpen: data.marketOpen || false
    };
  } catch (error) {
    console.error('Failed to fetch real-time prices:', error);
    return { data: [], marketOpen: false };
  }
}

function generatePatternBasedPrice(stock: Stock, historicalData: number[]): Stock {
  // Analyze pattern from historical price changes
  const avgChange = historicalData.reduce((sum, val) => sum + val, 0) / historicalData.length;
  const volatility = Math.sqrt(
    historicalData.reduce((sum, val) => sum + Math.pow(val - avgChange, 2), 0) / historicalData.length
  );
  
  // Generate change based on historical pattern with some randomness
  const trendFactor = avgChange * 0.7; // 70% weight to trend
  const randomFactor = (Math.random() - 0.5) * volatility * 0.3; // 30% random within volatility
  const changeAmount = (trendFactor + randomFactor) * stock.price / 100;
  
  const newPrice = Math.max(stock.price + changeAmount, 0.01);
  const newChange = stock.change + changeAmount;
  const newChangePercent = (newChange / (newPrice - newChange)) * 100;
  
  return {
    ...stock,
    price: parseFloat(newPrice.toFixed(2)),
    change: parseFloat(newChange.toFixed(2)),
    changePercent: parseFloat(newChangePercent.toFixed(2)),
    lastUpdated: new Date()
  };
}

export function useStockData(initialData: Stock[], updateInterval = 2000) {
  const [stocks, setStocks] = useState<Stock[]>(initialData);
  const [priceHistory, setPriceHistory] = useState<Map<string, number[]>>(() => {
    // Initialize with actual stock prices
    const historyMap = new Map<string, number[]>();
    initialData.forEach(stock => {
      historyMap.set(stock.symbol, [stock.price]);
    });
    return historyMap;
  });
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);
  const [lastRealPrices, setLastRealPrices] = useState<Map<string, number>>(() => {
    // Store last real exchange prices for each stock
    const pricesMap = new Map<string, number>();
    initialData.forEach(stock => {
      pricesMap.set(stock.symbol, stock.price);
    });
    return pricesMap;
  });
  const [failedStocks, setFailedStocks] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    // Initial fetch
    const updateStockPrices = async () => {
      const { data: realTimeData, marketOpen } = await fetchRealTimeStockPrices(stocks);
      setIsMarketOpen(marketOpen);
      
      const newFailedStocks = new Set<string>();
      
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          const realtimeStock = realTimeData.find(d => d.symbol === stock.symbol);
          
          // Find base price from mockStocks as fallback
          const baseStock = mockStocks.find(s => s.symbol === stock.symbol);
          const basePrice = baseStock?.price || stock.price;
          
          if (marketOpen && realtimeStock && !realtimeStock.error && !realtimeStock.marketClosed) {
            // Use real-time data from API when market is open
            const newPrice = realtimeStock.price || basePrice;
            const newStock = {
              ...stock,
              price: newPrice,
              change: realtimeStock.change || stock.change,
              changePercent: realtimeStock.changePercent || stock.changePercent,
              lastUpdated: new Date(),
              dataSource: 'real' as const
            };
            
            // Update price history with real prices from API
            setPriceHistory(prev => {
              const history = prev.get(stock.symbol) || [basePrice];
              const newHistory = [...history, newPrice].slice(-30);
              const newMap = new Map(prev);
              newMap.set(stock.symbol, newHistory);
              return newMap;
            });
            
            // Store this as the last real exchange price
            setLastRealPrices(prev => {
              const newMap = new Map(prev);
              newMap.set(stock.symbol, newPrice);
              return newMap;
            });
            
            return newStock;
          } else if (marketOpen && realtimeStock && realtimeStock.error) {
            // Track failed stocks during market hours
            newFailedStocks.add(stock.symbol);
          } else {
            // Market closed - use last real closing price from Yahoo Finance
            const hasRealData = realtimeStock && !realtimeStock.error && typeof realtimeStock.price === 'number' && realtimeStock.price > 0;
            const lastClosePrice = hasRealData 
              ? realtimeStock.price
              : (lastRealPrices.get(stock.symbol) || basePrice || stock.price);
            
            const lastCloseChange = hasRealData 
              ? (realtimeStock.change || 0)
              : 0;
            
            const lastCloseChangePercent = hasRealData 
              ? (realtimeStock.changePercent || 0)
              : 0;
            
            const newStock = {
              ...stock,
              price: parseFloat(lastClosePrice.toFixed(2)),
              change: parseFloat(lastCloseChange.toFixed(2)),
              changePercent: parseFloat(lastCloseChangePercent.toFixed(2)),
              lastUpdated: new Date(),
              dataSource: hasRealData ? 'real' as const : 'simulated' as const
            };
            
            // Store the last real price
            setLastRealPrices(prev => {
              const mp = new Map(prev);
              mp.set(stock.symbol, lastClosePrice);
              return mp;
            });
            
            // Update price history with last close price
            setPriceHistory(prev => {
              const history = prev.get(stock.symbol) || [lastClosePrice];
              // Only add to history if price actually changed
              const lastHistoryPrice = history[history.length - 1];
              const newHistory = lastHistoryPrice === lastClosePrice 
                ? history 
                : [...history, lastClosePrice].slice(-30);
              const newMap = new Map(prev);
              newMap.set(stock.symbol, newHistory);
              return newMap;
            });
            
            return newStock;
          }
        })
      );
      
      // Log failed stocks to console
      if (marketOpen && newFailedStocks.size > 0) {
        console.warn(`⚠️ Failed to fetch real data for ${newFailedStocks.size} stocks:`, Array.from(newFailedStocks));
      }
      
      setFailedStocks(newFailedStocks);
    };
    
    updateStockPrices();
    const intervalId = setInterval(updateStockPrices, updateInterval);
    
    return () => clearInterval(intervalId);
  }, [updateInterval]);
  
  return { stocks, priceHistory, isMarketOpen, failedStocks };
}

async function fetchRealTimeMarketIndices(indices: MarketIndex[]): Promise<{ data: any[], marketOpen: boolean }> {
  try {
    const symbols = indices.map(index => ({
      symbol: index.symbol
    }));
    
    const { data, error } = await supabase.functions.invoke('fetch-market-indices', {
      body: { symbols }
    });
    
    if (error) {
      console.error('Error fetching market indices:', error);
      return { data: [], marketOpen: false };
    }
    
    return {
      data: data.data || [],
      marketOpen: data.marketOpen || false
    };
  } catch (error) {
    console.error('Failed to fetch real-time indices:', error);
    return { data: [], marketOpen: false };
  }
}

export function useMarketIndices(initialData: MarketIndex[], updateInterval = 2000) {
  const [indices, setIndices] = useState<MarketIndex[]>(initialData);
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);
  const [lastRealValues, setLastRealValues] = useState<Map<string, number>>(() => {
    const valuesMap = new Map<string, number>();
    initialData.forEach(index => {
      valuesMap.set(index.symbol, index.value);
    });
    return valuesMap;
  });
  
  useEffect(() => {
    const updateIndices = async () => {
      const { data: realTimeData, marketOpen } = await fetchRealTimeMarketIndices(indices);
      setIsMarketOpen(marketOpen);
      
      setIndices(prevIndices => 
        prevIndices.map(index => {
          const realtimeIndex = realTimeData.find(d => d.symbol === index.symbol);
          
          const baseIndex = mockIndices.find(i => i.symbol === index.symbol);
          const baseValue = baseIndex?.value || index.value;
          
          if (marketOpen && realtimeIndex && !realtimeIndex.error && !realtimeIndex.marketClosed) {
            // Use real-time data from API when market is open
            const newValue = realtimeIndex.value || baseValue;
            const newStock = {
              ...index,
              value: newValue,
              change: realtimeIndex.change || index.change,
              changePercent: realtimeIndex.changePercent || index.changePercent,
              lastUpdated: new Date()
            };
            
            // Store this as the last real exchange value
            setLastRealValues(prev => {
              const newMap = new Map(prev);
              newMap.set(index.symbol, newValue);
              return newMap;
            });
            
            return newStock;
          } else {
            // Market closed - generate values within ±0.05% of last real value
            const lastRealValue = lastRealValues.get(index.symbol) || baseValue || index.value;
            
            const randomChangePercent = (Math.random() - 0.5) * 0.1; // Random value between -0.05 and +0.05
            const valueChange = lastRealValue * (randomChangePercent / 100);
            let newValue = lastRealValue + valueChange;
            
            newValue = Math.max(newValue, 0.01);
            
            const finalChange = newValue - lastRealValue;
            const finalChangePercent = (finalChange / lastRealValue) * 100;
            
            return {
              ...index,
              value: parseFloat(newValue.toFixed(2)),
              change: parseFloat(finalChange.toFixed(2)),
              changePercent: parseFloat(finalChangePercent.toFixed(2)),
              lastUpdated: new Date()
            };
          }
        })
      );
    };
    
    updateIndices();
    const intervalId = setInterval(updateIndices, updateInterval);
    
    return () => clearInterval(intervalId);
  }, [updateInterval]);
  
  return indices;
}

export function useCurrencyPairs(initialData: CurrencyPair[], updateInterval = 10000) {
  const [currencies, setCurrencies] = useState<CurrencyPair[]>(initialData);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrencies(prevCurrencies => 
        prevCurrencies.map(currency => {
          const changeAmount = (Math.random() - 0.5) * (currency.rate * 0.0008);
          const newRate = Math.max(currency.rate + changeAmount, 0.0001);
          const newChange = currency.change + changeAmount;
          const newChangePercent = (newChange / (newRate - newChange)) * 100;
          
          return {
            ...currency,
            rate: parseFloat(newRate.toFixed(4)),
            change: parseFloat(newChange.toFixed(4)),
            changePercent: parseFloat(newChangePercent.toFixed(2)),
            lastUpdated: new Date()
          };
        })
      );
    }, updateInterval);
    
    return () => clearInterval(intervalId);
  }, [initialData, updateInterval]);
  
  return currencies;
}

export function useCryptoData(initialData: Cryptocurrency[], updateInterval = 7000) {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>(initialData);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCryptos(prevCryptos => 
        prevCryptos.map(crypto => {
          const volatilityFactor = crypto.symbol === 'BTC' || crypto.symbol === 'ETH' ? 0.005 : 0.012;
          const changeAmount = (Math.random() - 0.5) * (crypto.price * volatilityFactor);
          const newPrice = Math.max(crypto.price + changeAmount, 0.000001);
          const newChange = crypto.change + changeAmount;
          const newChangePercent = (newChange / (newPrice - newChange)) * 100;
          
          return {
            ...crypto,
            price: parseFloat(newPrice.toFixed(crypto.price < 1 ? 4 : 2)),
            change: parseFloat(newChange.toFixed(crypto.price < 1 ? 4 : 2)),
            changePercent: parseFloat(newChangePercent.toFixed(2)),
            lastUpdated: new Date()
          };
        })
      );
    }, updateInterval);
    
    return () => clearInterval(intervalId);
  }, [initialData, updateInterval]);
  
  return cryptos;
}
