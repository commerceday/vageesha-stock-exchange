import { useState, useEffect } from 'react';

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
    price: 2847.50,
    change: 23.75,
    changePercent: 0.84,
    volume: 8934210,
    marketCap: 19250000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd.',
    price: 3842.30,
    change: 45.60,
    changePercent: 1.20,
    volume: 2154780,
    marketCap: 14050000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    price: 1687.85,
    change: -12.35,
    changePercent: -0.73,
    volume: 5729340,
    marketCap: 12850000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    price: 1542.60,
    change: 18.40,
    changePercent: 1.21,
    volume: 4194600,
    marketCap: 6420000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd.',
    price: 1098.75,
    change: 8.25,
    changePercent: 0.76,
    volume: 6638210,
    marketCap: 7680000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd.',
    price: 1345.90,
    change: -15.60,
    changePercent: -1.15,
    volume: 3129580,
    marketCap: 7850000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    price: 742.35,
    change: 9.80,
    changePercent: 1.34,
    volume: 8283940,
    marketCap: 6620000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'HINDUNILVR',
    name: 'Hindustan Unilever Ltd.',
    price: 2456.20,
    change: -8.45,
    changePercent: -0.34,
    volume: 1943760,
    marketCap: 5780000000000,
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
    return `$${(num / 1000000000000).toFixed(2)}T`;
  }
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(2)}B`;
  }
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(2)}K`;
  }
  return `$${num.toFixed(2)}`;
}

export function formatPercentage(num: number): string {
  return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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

export function useStockData(initialData: Stock[], updateInterval = 5000) {
  const [stocks, setStocks] = useState<Stock[]>(initialData);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          const changeAmount = (Math.random() - 0.5) * (stock.price * 0.01);
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
        })
      );
    }, updateInterval);
    
    return () => clearInterval(intervalId);
  }, [initialData, updateInterval]);
  
  return stocks;
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
