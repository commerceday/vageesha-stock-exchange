import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  lastUpdated: Date;
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

export const mockStocks: Stock[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    price: 1285.40,
    change: 10.50,
    changePercent: 0.82,
    volume: 8934210,
    marketCap: 17350000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd.',
    price: 3456.75,
    change: 42.20,
    changePercent: 1.24,
    volume: 2154780,
    marketCap: 12650000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    price: 1542.30,
    change: -11.25,
    changePercent: -0.72,
    volume: 5729340,
    marketCap: 11750000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    price: 1623.85,
    change: 19.60,
    changePercent: 1.22,
    volume: 4194600,
    marketCap: 6720000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd.',
    price: 1089.50,
    change: 8.15,
    changePercent: 0.75,
    volume: 6638210,
    marketCap: 7620000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd.',
    price: 1534.20,
    change: -17.80,
    changePercent: -1.15,
    volume: 3129580,
    marketCap: 8950000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    price: 798.65,
    change: 10.55,
    changePercent: 1.34,
    volume: 8283940,
    marketCap: 7120000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'HINDUNILVR',
    name: 'Hindustan Unilever Ltd.',
    price: 2387.40,
    change: -8.20,
    changePercent: -0.34,
    volume: 1943760,
    marketCap: 5620000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'ITC',
    name: 'ITC Ltd.',
    price: 423.75,
    change: 5.05,
    changePercent: 1.21,
    volume: 7254890,
    marketCap: 5270000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'LT',
    name: 'Larsen & Toubro Ltd.',
    price: 3289.50,
    change: -20.65,
    changePercent: -0.62,
    volume: 1845670,
    marketCap: 4510000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'AXISBANK',
    name: 'Axis Bank Ltd.',
    price: 1067.85,
    change: 12.10,
    changePercent: 1.15,
    volume: 4567230,
    marketCap: 3310000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'KOTAKBANK',
    name: 'Kotak Mahindra Bank Ltd.',
    price: 1723.40,
    change: -17.55,
    changePercent: -1.01,
    volume: 2346780,
    marketCap: 3420000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'BAJFINANCE',
    name: 'Bajaj Finance Ltd.',
    price: 6234.50,
    change: 71.90,
    changePercent: 1.17,
    volume: 987650,
    marketCap: 3850000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'MARUTI',
    name: 'Maruti Suzuki India Ltd.',
    price: 10876.25,
    change: -126.70,
    changePercent: -1.15,
    volume: 456230,
    marketCap: 3290000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'WIPRO',
    name: 'Wipro Ltd.',
    price: 287.60,
    change: 3.90,
    changePercent: 1.38,
    volume: 5234560,
    marketCap: 1560000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd.',
    price: 784.30,
    change: 12.75,
    changePercent: 1.65,
    volume: 6845320,
    marketCap: 2780000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'ASIANPAINT',
    name: 'Asian Paints Ltd.',
    price: 2456.80,
    change: -20.50,
    changePercent: -0.83,
    volume: 1234560,
    marketCap: 2350000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'HCLTECH',
    name: 'HCL Technologies Ltd.',
    price: 1698.45,
    change: 21.30,
    changePercent: 1.27,
    volume: 2345670,
    marketCap: 4610000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'TITAN',
    name: 'Titan Company Ltd.',
    price: 3187.65,
    change: 41.50,
    changePercent: 1.32,
    volume: 1876540,
    marketCap: 2830000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'NESTLEIND',
    name: 'Nestle India Ltd.',
    price: 1176.80,
    change: -7.45,
    changePercent: -0.63,
    volume: 234560,
    marketCap: 1134000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'SUNPHARMA',
    name: 'Sun Pharmaceutical Industries Ltd.',
    price: 1756.35,
    change: 23.10,
    changePercent: 1.33,
    volume: 3456780,
    marketCap: 4210000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'ONGC',
    name: 'Oil & Natural Gas Corporation Ltd.',
    price: 241.75,
    change: -3.55,
    changePercent: -1.45,
    volume: 9876540,
    marketCap: 3040000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'ULTRACEMCO',
    name: 'UltraTech Cement Ltd.',
    price: 11234.80,
    change: 77.40,
    changePercent: 0.69,
    volume: 345670,
    marketCap: 3230000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'ADANIGREEN',
    name: 'Adani Green Energy Ltd.',
    price: 956.85,
    change: -16.80,
    changePercent: -1.73,
    volume: 2345670,
    marketCap: 1520000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'TATASTEEL',
    name: 'Tata Steel Ltd.',
    price: 143.50,
    change: 2.51,
    changePercent: 1.78,
    volume: 15678900,
    marketCap: 1760000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'POWERGRID',
    name: 'Power Grid Corporation of India Ltd.',
    price: 323.75,
    change: 4.69,
    changePercent: 1.47,
    volume: 4567890,
    marketCap: 2980000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'BAJAJFINSV',
    name: 'Bajaj Finserv Ltd.',
    price: 1598.20,
    change: 18.33,
    changePercent: 1.16,
    volume: 1234560,
    marketCap: 2540000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'TECHM',
    name: 'Tech Mahindra Ltd.',
    price: 1634.85,
    change: -19.88,
    changePercent: -1.20,
    volume: 2345670,
    marketCap: 1590000000000,
    lastUpdated: new Date()
  }
];

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

export function useStockData(initialData: Stock[], updateInterval = 5000) {
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
  const [stockTrends, setStockTrends] = useState<Map<string, { direction: number; momentum: number }>>(() => {
    // Initialize trends for realistic ups and downs
    const trendsMap = new Map<string, { direction: number; momentum: number }>();
    initialData.forEach(stock => {
      trendsMap.set(stock.symbol, {
        direction: Math.random() > 0.5 ? 1 : -1, // Random initial direction
        momentum: Math.random() * 0.5 + 0.3 // Random momentum between 0.3 and 0.8
      });
    });
    return trendsMap;
  });
  
  useEffect(() => {
    // Initial fetch
    const updateStockPrices = async () => {
      const { data: realTimeData, marketOpen } = await fetchRealTimeStockPrices(stocks);
      setIsMarketOpen(marketOpen);
      
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
              lastUpdated: new Date()
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
          } else {
            // Market closed - generate realistic ups and downs within ±5 rupees of last real price
            const lastKnownHistory = priceHistory.get(stock.symbol) || [stock.price];
            const lastKnownPrice = lastKnownHistory[lastKnownHistory.length - 1] || stock.price;
            const lastRealPrice = lastRealPrices.get(stock.symbol) || basePrice || stock.price;
            
            // Get or create trend for this stock
            const currentTrend = stockTrends.get(stock.symbol) || { direction: 1, momentum: 0.5 };
            
            // Randomly change direction (10% chance) for realistic market behavior
            let newDirection = currentTrend.direction;
            let newMomentum = currentTrend.momentum;
            
            if (Math.random() < 0.1) {
              // Trend reversal
              newDirection = -currentTrend.direction;
              newMomentum = Math.random() * 0.5 + 0.3; // New momentum between 0.3 and 0.8
            } else {
              // Continue current trend with slight momentum decay
              newMomentum = Math.max(0.2, currentTrend.momentum * (0.95 + Math.random() * 0.1));
            }
            
            // Update trend state
            setStockTrends(prev => {
              const newMap = new Map(prev);
              newMap.set(stock.symbol, { direction: newDirection, momentum: newMomentum });
              return newMap;
            });
            
            // Calculate realistic price movement (0.1% to 0.8% per update)
            const volatility = 0.002 + Math.random() * 0.006; // Between 0.2% and 0.8%
            const priceVariation = lastKnownPrice * volatility * newDirection * newMomentum;
            let newPrice = lastKnownPrice + priceVariation;
            
            // Constrain price to be within ±5 rupees of last real exchange price
            const minPrice = lastRealPrice - 5;
            const maxPrice = lastRealPrice + 5;
            newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice));
            
            // Ensure price stays positive
            newPrice = Math.max(newPrice, 0.01);
            
            const priceChange = newPrice - lastKnownPrice;
            const changePercent = (priceChange / lastKnownPrice) * 100;
            
            const newStock = {
              ...stock,
              price: newPrice,
              change: priceChange,
              changePercent: changePercent,
              lastUpdated: new Date()
            };
            
            // Update price history with generated prices
            setPriceHistory(prev => {
              const history = prev.get(stock.symbol) || [lastKnownPrice];
              const newHistory = [...history, newPrice].slice(-30);
              const newMap = new Map(prev);
              newMap.set(stock.symbol, newHistory);
              return newMap;
            });
            
            return newStock;
          }
        })
      );
    };
    
    updateStockPrices();
    const intervalId = setInterval(updateStockPrices, updateInterval);
    
    return () => clearInterval(intervalId);
  }, [updateInterval]);
  
  return { stocks, priceHistory, isMarketOpen };
}

export function useMarketIndices(initialData: MarketIndex[], updateInterval = 8000) {
  const [indices, setIndices] = useState<MarketIndex[]>(initialData);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndices(prevIndices => 
        prevIndices.map(index => {
          const changeAmount = (Math.random() - 0.5) * (index.value * 0.0015);
          const newValue = Math.max(index.value + changeAmount, 0.01);
          const newChange = index.change + changeAmount;
          const newChangePercent = (newChange / (newValue - newChange)) * 100;
          
          return {
            ...index,
            value: parseFloat(newValue.toFixed(2)),
            change: parseFloat(newChange.toFixed(2)),
            changePercent: parseFloat(newChangePercent.toFixed(2)),
            lastUpdated: new Date()
          };
        })
      );
    }, updateInterval);
    
    return () => clearInterval(intervalId);
  }, [initialData, updateInterval]);
  
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
