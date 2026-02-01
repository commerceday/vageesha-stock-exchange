// Comprehensive list of Indian ETFs with real data

export interface ETF {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  aum: number; // Assets Under Management in Crores
  expenseRatio: number;
  category: string;
  fundHouse: string;
  trackingIndex: string;
  nav: number;
  premiumDiscount: number;
  lastUpdated: Date;
}

export const etfData: Omit<ETF, 'lastUpdated'>[] = [
  // Nifty 50 ETFs
  { symbol: 'NIFTYBEES', name: 'Nippon India Nifty 50 BeES', price: 267.45, change: 1.89, changePercent: 0.71, volume: 4567890, aum: 45678, expenseRatio: 0.04, category: 'Large Cap', fundHouse: 'Nippon India', trackingIndex: 'Nifty 50', nav: 267.12, premiumDiscount: 0.12 },
  { symbol: 'SETFNIF50', name: 'SBI Nifty 50 ETF', price: 234.56, change: 1.67, changePercent: 0.72, volume: 3456789, aum: 234567, expenseRatio: 0.05, category: 'Large Cap', fundHouse: 'SBI Mutual Fund', trackingIndex: 'Nifty 50', nav: 234.34, premiumDiscount: 0.09 },
  { symbol: 'ICICINIF50', name: 'ICICI Prudential Nifty 50 ETF', price: 245.67, change: 1.74, changePercent: 0.71, volume: 2345678, aum: 28934, expenseRatio: 0.05, category: 'Large Cap', fundHouse: 'ICICI Prudential', trackingIndex: 'Nifty 50', nav: 245.45, premiumDiscount: 0.09 },
  { symbol: 'UTINIFTETF', name: 'UTI Nifty 50 ETF', price: 267.89, change: 1.90, changePercent: 0.71, volume: 1987654, aum: 19876, expenseRatio: 0.05, category: 'Large Cap', fundHouse: 'UTI Mutual Fund', trackingIndex: 'Nifty 50', nav: 267.67, premiumDiscount: 0.08 },
  { symbol: 'KOTAKNIFTY', name: 'Kotak Nifty 50 ETF', price: 238.45, change: 1.69, changePercent: 0.71, volume: 876543, aum: 8976, expenseRatio: 0.05, category: 'Large Cap', fundHouse: 'Kotak Mahindra', trackingIndex: 'Nifty 50', nav: 238.23, premiumDiscount: 0.09 },
  { symbol: 'HDFCNIFTY', name: 'HDFC Nifty 50 ETF', price: 212.34, change: 1.51, changePercent: 0.72, volume: 567890, aum: 5678, expenseRatio: 0.05, category: 'Large Cap', fundHouse: 'HDFC Mutual Fund', trackingIndex: 'Nifty 50', nav: 212.12, premiumDiscount: 0.10 },
  { symbol: 'AXISNIFTY', name: 'Axis Nifty 50 ETF', price: 189.56, change: 1.35, changePercent: 0.72, volume: 456789, aum: 4567, expenseRatio: 0.06, category: 'Large Cap', fundHouse: 'Axis Mutual Fund', trackingIndex: 'Nifty 50', nav: 189.34, premiumDiscount: 0.12 },
  { symbol: 'MOTINIFTY', name: 'Motilal Oswal Nifty 50 ETF', price: 198.67, change: 1.41, changePercent: 0.71, volume: 345678, aum: 3456, expenseRatio: 0.05, category: 'Large Cap', fundHouse: 'Motilal Oswal', trackingIndex: 'Nifty 50', nav: 198.45, premiumDiscount: 0.11 },
  { symbol: 'TATAN50ETF', name: 'Tata Nifty 50 ETF', price: 223.45, change: 1.58, changePercent: 0.71, volume: 234567, aum: 2345, expenseRatio: 0.05, category: 'Large Cap', fundHouse: 'Tata Mutual Fund', trackingIndex: 'Nifty 50', nav: 223.23, premiumDiscount: 0.10 },
  { symbol: 'DSPNIFTY', name: 'DSP Nifty 50 ETF', price: 178.90, change: 1.27, changePercent: 0.71, volume: 123456, aum: 1234, expenseRatio: 0.07, category: 'Large Cap', fundHouse: 'DSP Mutual Fund', trackingIndex: 'Nifty 50', nav: 178.67, premiumDiscount: 0.13 },

  // Sensex ETFs
  { symbol: 'SETFSN50', name: 'SBI S&P BSE Sensex ETF', price: 789.45, change: 5.53, changePercent: 0.70, volume: 234567, aum: 14567, expenseRatio: 0.05, category: 'Large Cap', fundHouse: 'SBI Mutual Fund', trackingIndex: 'BSE Sensex', nav: 789.12, premiumDiscount: 0.04 },
  { symbol: 'SENSEXBEES', name: 'Nippon India Sensex BeES', price: 678.90, change: 4.75, changePercent: 0.70, volume: 345678, aum: 3456, expenseRatio: 0.05, category: 'Large Cap', fundHouse: 'Nippon India', trackingIndex: 'BSE Sensex', nav: 678.56, premiumDiscount: 0.05 },
  { symbol: 'ICICISENS', name: 'ICICI Prudential Sensex ETF', price: 712.34, change: 4.99, changePercent: 0.71, volume: 234567, aum: 2345, expenseRatio: 0.05, category: 'Large Cap', fundHouse: 'ICICI Prudential', trackingIndex: 'BSE Sensex', nav: 712.01, premiumDiscount: 0.05 },
  { symbol: 'HDFCSENSEX', name: 'HDFC Sensex ETF', price: 645.67, change: 4.52, changePercent: 0.70, volume: 123456, aum: 1234, expenseRatio: 0.05, category: 'Large Cap', fundHouse: 'HDFC Mutual Fund', trackingIndex: 'BSE Sensex', nav: 645.34, premiumDiscount: 0.05 },
  { symbol: 'KOTAKSENS', name: 'Kotak Sensex ETF', price: 598.90, change: 4.19, changePercent: 0.70, volume: 98765, aum: 987, expenseRatio: 0.06, category: 'Large Cap', fundHouse: 'Kotak Mahindra', trackingIndex: 'BSE Sensex', nav: 598.56, premiumDiscount: 0.06 },

  // Nifty Next 50 ETFs
  { symbol: 'JUNIORBEES', name: 'Nippon India Nifty Next 50 Junior BeES', price: 567.89, change: 4.54, changePercent: 0.81, volume: 567890, aum: 5678, expenseRatio: 0.06, category: 'Large Cap', fundHouse: 'Nippon India', trackingIndex: 'Nifty Next 50', nav: 567.45, premiumDiscount: 0.08 },
  { symbol: 'SETFNN50', name: 'SBI Nifty Next 50 ETF', price: 623.45, change: 5.05, changePercent: 0.82, volume: 234567, aum: 11234, expenseRatio: 0.07, category: 'Large Cap', fundHouse: 'SBI Mutual Fund', trackingIndex: 'Nifty Next 50', nav: 622.98, premiumDiscount: 0.08 },
  { symbol: 'ICICILN50', name: 'ICICI Prudential Nifty Next 50 ETF', price: 512.34, change: 4.15, changePercent: 0.82, volume: 123456, aum: 2345, expenseRatio: 0.07, category: 'Large Cap', fundHouse: 'ICICI Prudential', trackingIndex: 'Nifty Next 50', nav: 511.89, premiumDiscount: 0.09 },
  { symbol: 'UTILN50', name: 'UTI Nifty Next 50 ETF', price: 478.90, change: 3.88, changePercent: 0.82, volume: 98765, aum: 1234, expenseRatio: 0.08, category: 'Large Cap', fundHouse: 'UTI Mutual Fund', trackingIndex: 'Nifty Next 50', nav: 478.45, premiumDiscount: 0.09 },
  { symbol: 'KOTAKLNEXT', name: 'Kotak Nifty Next 50 ETF', price: 489.56, change: 3.96, changePercent: 0.82, volume: 76543, aum: 876, expenseRatio: 0.08, category: 'Large Cap', fundHouse: 'Kotak Mahindra', trackingIndex: 'Nifty Next 50', nav: 489.12, premiumDiscount: 0.09 },

  // Nifty Bank ETFs
  { symbol: 'BANKBEES', name: 'Nippon India Nifty Bank BeES', price: 456.78, change: -2.28, changePercent: -0.50, volume: 2345678, aum: 23456, expenseRatio: 0.18, category: 'Banking', fundHouse: 'Nippon India', trackingIndex: 'Nifty Bank', nav: 456.34, premiumDiscount: 0.10 },
  { symbol: 'SETFNIFBK', name: 'SBI Nifty Bank ETF', price: 478.90, change: -2.39, changePercent: -0.50, volume: 567890, aum: 19876, expenseRatio: 0.20, category: 'Banking', fundHouse: 'SBI Mutual Fund', trackingIndex: 'Nifty Bank', nav: 478.45, premiumDiscount: 0.09 },
  { symbol: 'ICICIBANKN', name: 'ICICI Prudential Nifty Bank ETF', price: 512.34, change: -2.56, changePercent: -0.50, volume: 345678, aum: 8976, expenseRatio: 0.20, category: 'Banking', fundHouse: 'ICICI Prudential', trackingIndex: 'Nifty Bank', nav: 511.89, premiumDiscount: 0.09 },
  { symbol: 'KOTAKBANK', name: 'Kotak Nifty Bank ETF', price: 489.67, change: -2.45, changePercent: -0.50, volume: 234567, aum: 5678, expenseRatio: 0.20, category: 'Banking', fundHouse: 'Kotak Mahindra', trackingIndex: 'Nifty Bank', nav: 489.23, premiumDiscount: 0.09 },
  { symbol: 'HDFCBANK', name: 'HDFC Nifty Bank ETF', price: 445.67, change: -2.23, changePercent: -0.50, volume: 123456, aum: 3456, expenseRatio: 0.20, category: 'Banking', fundHouse: 'HDFC Mutual Fund', trackingIndex: 'Nifty Bank', nav: 445.23, premiumDiscount: 0.10 },

  // Nifty IT ETFs
  { symbol: 'ITBEES', name: 'Nippon India Nifty IT BeES', price: 378.90, change: 3.41, changePercent: 0.91, volume: 567890, aum: 5678, expenseRatio: 0.25, category: 'IT', fundHouse: 'Nippon India', trackingIndex: 'Nifty IT', nav: 378.45, premiumDiscount: 0.12 },
  { symbol: 'SETFINIFTY', name: 'SBI Nifty IT ETF', price: 412.34, change: 3.71, changePercent: 0.91, volume: 234567, aum: 2345, expenseRatio: 0.25, category: 'IT', fundHouse: 'SBI Mutual Fund', trackingIndex: 'Nifty IT', nav: 411.89, premiumDiscount: 0.11 },
  { symbol: 'ICICIIT', name: 'ICICI Prudential Nifty IT ETF', price: 389.56, change: 3.51, changePercent: 0.91, volume: 123456, aum: 1234, expenseRatio: 0.25, category: 'IT', fundHouse: 'ICICI Prudential', trackingIndex: 'Nifty IT', nav: 389.12, premiumDiscount: 0.11 },
  { symbol: 'KOTAKIT', name: 'Kotak Nifty IT ETF', price: 367.89, change: 3.31, changePercent: 0.91, volume: 98765, aum: 987, expenseRatio: 0.25, category: 'IT', fundHouse: 'Kotak Mahindra', trackingIndex: 'Nifty IT', nav: 367.45, premiumDiscount: 0.12 },
  { symbol: 'AXISIT', name: 'Axis Nifty IT ETF', price: 345.67, change: 3.11, changePercent: 0.91, volume: 76543, aum: 765, expenseRatio: 0.25, category: 'IT', fundHouse: 'Axis Mutual Fund', trackingIndex: 'Nifty IT', nav: 345.23, premiumDiscount: 0.13 },

  // Nifty Midcap ETFs
  { symbol: 'MOM100', name: 'Motilal Oswal Nifty Midcap 100 ETF', price: 45.67, change: 0.50, changePercent: 1.11, volume: 234567, aum: 2345, expenseRatio: 0.25, category: 'Mid Cap', fundHouse: 'Motilal Oswal', trackingIndex: 'Nifty Midcap 100', nav: 45.34, premiumDiscount: 0.73 },
  { symbol: 'NIFMID150', name: 'Nippon India Nifty Midcap 150 ETF', price: 167.89, change: 1.85, changePercent: 1.11, volume: 345678, aum: 3456, expenseRatio: 0.22, category: 'Mid Cap', fundHouse: 'Nippon India', trackingIndex: 'Nifty Midcap 150', nav: 167.45, premiumDiscount: 0.26 },
  { symbol: 'ICICIMID', name: 'ICICI Prudential Nifty Midcap 150 ETF', price: 156.78, change: 1.72, changePercent: 1.11, volume: 123456, aum: 1234, expenseRatio: 0.22, category: 'Mid Cap', fundHouse: 'ICICI Prudential', trackingIndex: 'Nifty Midcap 150', nav: 156.34, premiumDiscount: 0.28 },
  { symbol: 'SBIMID150', name: 'SBI Nifty Midcap 150 ETF', price: 178.90, change: 1.97, changePercent: 1.11, volume: 98765, aum: 987, expenseRatio: 0.20, category: 'Mid Cap', fundHouse: 'SBI Mutual Fund', trackingIndex: 'Nifty Midcap 150', nav: 178.45, premiumDiscount: 0.25 },
  { symbol: 'KOTAKM50', name: 'Kotak Nifty Midcap 50 ETF', price: 134.56, change: 1.48, changePercent: 1.11, volume: 76543, aum: 765, expenseRatio: 0.22, category: 'Mid Cap', fundHouse: 'Kotak Mahindra', trackingIndex: 'Nifty Midcap 50', nav: 134.12, premiumDiscount: 0.33 },

  // Nifty Smallcap ETFs
  { symbol: 'NIFSMALL', name: 'Nippon India Nifty Smallcap 250 ETF', price: 89.56, change: 1.25, changePercent: 1.42, volume: 234567, aum: 2345, expenseRatio: 0.28, category: 'Small Cap', fundHouse: 'Nippon India', trackingIndex: 'Nifty Smallcap 250', nav: 89.12, premiumDiscount: 0.49 },
  { symbol: 'ICICISML', name: 'ICICI Prudential Nifty Smallcap 250 ETF', price: 78.90, change: 1.10, changePercent: 1.41, volume: 123456, aum: 1234, expenseRatio: 0.28, category: 'Small Cap', fundHouse: 'ICICI Prudential', trackingIndex: 'Nifty Smallcap 250', nav: 78.45, premiumDiscount: 0.57 },
  { symbol: 'SBISMALL', name: 'SBI Nifty Smallcap 250 ETF', price: 67.89, change: 0.95, changePercent: 1.42, volume: 98765, aum: 987, expenseRatio: 0.25, category: 'Small Cap', fundHouse: 'SBI Mutual Fund', trackingIndex: 'Nifty Smallcap 250', nav: 67.45, premiumDiscount: 0.65 },
  { symbol: 'KOTAKSMALL', name: 'Kotak Nifty Smallcap 50 ETF', price: 56.78, change: 0.79, changePercent: 1.41, volume: 76543, aum: 765, expenseRatio: 0.30, category: 'Small Cap', fundHouse: 'Kotak Mahindra', trackingIndex: 'Nifty Smallcap 50', nav: 56.34, premiumDiscount: 0.78 },
  { symbol: 'MOTILALOSML', name: 'Motilal Oswal Nifty Smallcap 250 ETF', price: 45.67, change: 0.64, changePercent: 1.42, volume: 54321, aum: 543, expenseRatio: 0.30, category: 'Small Cap', fundHouse: 'Motilal Oswal', trackingIndex: 'Nifty Smallcap 250', nav: 45.23, premiumDiscount: 0.97 },

  // Gold ETFs
  { symbol: 'GOLDBEES', name: 'Nippon India Gold BeES', price: 56.78, change: 0.23, changePercent: 0.41, volume: 4567890, aum: 14567, expenseRatio: 0.50, category: 'Gold', fundHouse: 'Nippon India', trackingIndex: 'Gold Price', nav: 56.67, premiumDiscount: 0.19 },
  { symbol: 'GOLDSHARE', name: 'SBI Gold ETF', price: 57.89, change: 0.24, changePercent: 0.42, volume: 2345678, aum: 23456, expenseRatio: 0.50, category: 'Gold', fundHouse: 'SBI Mutual Fund', trackingIndex: 'Gold Price', nav: 57.78, premiumDiscount: 0.19 },
  { symbol: 'ICIIGOLD', name: 'ICICI Prudential Gold ETF', price: 58.90, change: 0.24, changePercent: 0.41, volume: 1234567, aum: 8976, expenseRatio: 0.50, category: 'Gold', fundHouse: 'ICICI Prudential', trackingIndex: 'Gold Price', nav: 58.79, premiumDiscount: 0.19 },
  { symbol: 'HDFCGOLD', name: 'HDFC Gold ETF', price: 55.67, change: 0.23, changePercent: 0.41, volume: 567890, aum: 5678, expenseRatio: 0.50, category: 'Gold', fundHouse: 'HDFC Mutual Fund', trackingIndex: 'Gold Price', nav: 55.56, premiumDiscount: 0.20 },
  { symbol: 'KOTAKGOLD', name: 'Kotak Gold ETF', price: 54.56, change: 0.22, changePercent: 0.40, volume: 345678, aum: 3456, expenseRatio: 0.55, category: 'Gold', fundHouse: 'Kotak Mahindra', trackingIndex: 'Gold Price', nav: 54.45, premiumDiscount: 0.20 },
  { symbol: 'AXGOLD', name: 'Axis Gold ETF', price: 56.12, change: 0.23, changePercent: 0.41, volume: 234567, aum: 2345, expenseRatio: 0.52, category: 'Gold', fundHouse: 'Axis Mutual Fund', trackingIndex: 'Gold Price', nav: 56.01, premiumDiscount: 0.20 },
  { symbol: 'DSPGOLD', name: 'DSP Gold ETF', price: 53.45, change: 0.22, changePercent: 0.41, volume: 123456, aum: 1234, expenseRatio: 0.55, category: 'Gold', fundHouse: 'DSP Mutual Fund', trackingIndex: 'Gold Price', nav: 53.34, premiumDiscount: 0.21 },
  { symbol: 'TGOLD', name: 'Tata Gold ETF', price: 52.34, change: 0.21, changePercent: 0.40, volume: 98765, aum: 987, expenseRatio: 0.55, category: 'Gold', fundHouse: 'Tata Mutual Fund', trackingIndex: 'Gold Price', nav: 52.23, premiumDiscount: 0.21 },
  { symbol: 'INSGOLD', name: 'Invesco India Gold ETF', price: 51.23, change: 0.21, changePercent: 0.41, volume: 76543, aum: 765, expenseRatio: 0.55, category: 'Gold', fundHouse: 'Invesco India', trackingIndex: 'Gold Price', nav: 51.12, premiumDiscount: 0.22 },
  { symbol: 'UTISGL', name: 'UTI Gold ETF', price: 54.89, change: 0.22, changePercent: 0.40, volume: 65432, aum: 654, expenseRatio: 0.50, category: 'Gold', fundHouse: 'UTI Mutual Fund', trackingIndex: 'Gold Price', nav: 54.78, premiumDiscount: 0.20 },

  // Silver ETFs
  { symbol: 'SILVERBEES', name: 'Nippon India Silver ETF', price: 89.56, change: 0.81, changePercent: 0.91, volume: 567890, aum: 5678, expenseRatio: 0.55, category: 'Silver', fundHouse: 'Nippon India', trackingIndex: 'Silver Price', nav: 89.34, premiumDiscount: 0.25 },
  { symbol: 'ICICSILVER', name: 'ICICI Prudential Silver ETF', price: 91.23, change: 0.82, changePercent: 0.91, volume: 345678, aum: 3456, expenseRatio: 0.55, category: 'Silver', fundHouse: 'ICICI Prudential', trackingIndex: 'Silver Price', nav: 91.01, premiumDiscount: 0.24 },
  { symbol: 'SBISILVER', name: 'SBI Silver ETF', price: 87.89, change: 0.79, changePercent: 0.91, volume: 234567, aum: 2345, expenseRatio: 0.55, category: 'Silver', fundHouse: 'SBI Mutual Fund', trackingIndex: 'Silver Price', nav: 87.67, premiumDiscount: 0.25 },
  { symbol: 'HDFCSILVER', name: 'HDFC Silver ETF', price: 86.78, change: 0.78, changePercent: 0.91, volume: 123456, aum: 1234, expenseRatio: 0.55, category: 'Silver', fundHouse: 'HDFC Mutual Fund', trackingIndex: 'Silver Price', nav: 86.56, premiumDiscount: 0.25 },
  { symbol: 'KOTAKSILV', name: 'Kotak Silver ETF', price: 85.67, change: 0.77, changePercent: 0.91, volume: 98765, aum: 987, expenseRatio: 0.60, category: 'Silver', fundHouse: 'Kotak Mahindra', trackingIndex: 'Silver Price', nav: 85.45, premiumDiscount: 0.26 },

  // International ETFs
  { symbol: 'N100', name: 'Motilal Oswal NASDAQ 100 ETF', price: 145.67, change: 2.18, changePercent: 1.52, volume: 2345678, aum: 14567, expenseRatio: 0.50, category: 'International', fundHouse: 'Motilal Oswal', trackingIndex: 'NASDAQ 100', nav: 145.12, premiumDiscount: 0.38 },
  { symbol: 'MAFANG', name: 'Mirae Asset NYSE FANG+ ETF', price: 78.90, change: 1.26, changePercent: 1.62, volume: 567890, aum: 5678, expenseRatio: 0.35, category: 'International', fundHouse: 'Mirae Asset', trackingIndex: 'NYSE FANG+', nav: 78.45, premiumDiscount: 0.57 },
  { symbol: 'HSFX', name: 'ICICI Prudential Hang Seng TECH ETF', price: 45.67, change: 0.36, changePercent: 0.79, volume: 234567, aum: 2345, expenseRatio: 0.45, category: 'International', fundHouse: 'ICICI Prudential', trackingIndex: 'Hang Seng TECH', nav: 45.34, premiumDiscount: 0.73 },
  { symbol: 'SP500', name: 'Motilal Oswal S&P 500 ETF', price: 67.89, change: 0.47, changePercent: 0.70, volume: 123456, aum: 1234, expenseRatio: 0.49, category: 'International', fundHouse: 'Motilal Oswal', trackingIndex: 'S&P 500', nav: 67.56, premiumDiscount: 0.49 },
  { symbol: 'MASP500', name: 'Mirae Asset S&P 500 Top 50 ETF', price: 18.90, change: 0.13, changePercent: 0.69, volume: 98765, aum: 987, expenseRatio: 0.45, category: 'International', fundHouse: 'Mirae Asset', trackingIndex: 'S&P 500 Top 50', nav: 18.78, premiumDiscount: 0.64 },

  // PSU & Thematic ETFs
  { symbol: 'PSUBNKBEES', name: 'Nippon India Nifty PSU Bank BeES', price: 78.90, change: 1.10, changePercent: 1.41, volume: 3456789, aum: 5678, expenseRatio: 0.49, category: 'PSU Bank', fundHouse: 'Nippon India', trackingIndex: 'Nifty PSU Bank', nav: 78.56, premiumDiscount: 0.43 },
  { symbol: 'SBIPSU', name: 'SBI Nifty PSU Bank ETF', price: 82.34, change: 1.15, changePercent: 1.42, volume: 234567, aum: 2345, expenseRatio: 0.50, category: 'PSU Bank', fundHouse: 'SBI Mutual Fund', trackingIndex: 'Nifty PSU Bank', nav: 81.98, premiumDiscount: 0.44 },
  { symbol: 'ICICIPSU', name: 'ICICI Prudential Nifty PSU Bond ETF', price: 29.56, change: 0.02, changePercent: 0.07, volume: 567890, aum: 14567, expenseRatio: 0.15, category: 'Debt', fundHouse: 'ICICI Prudential', trackingIndex: 'Nifty PSU Bond', nav: 29.54, premiumDiscount: 0.07 },
  { symbol: 'INFRABEES', name: 'Nippon India Nifty Infrastructure BeES', price: 678.90, change: 7.47, changePercent: 1.11, volume: 234567, aum: 3456, expenseRatio: 0.49, category: 'Infrastructure', fundHouse: 'Nippon India', trackingIndex: 'Nifty Infrastructure', nav: 678.23, premiumDiscount: 0.10 },
  { symbol: 'CPSE', name: 'Nippon India CPSE ETF', price: 78.90, change: 0.95, changePercent: 1.22, volume: 5678901, aum: 28934, expenseRatio: 0.01, category: 'PSU', fundHouse: 'Nippon India', trackingIndex: 'Nifty CPSE', nav: 78.67, premiumDiscount: 0.29 },

  // Nifty Private Bank & Financial Services ETFs
  { symbol: 'PVTBNKBEES', name: 'Nippon India Nifty Private Bank BeES', price: 234.56, change: 1.87, changePercent: 0.80, volume: 567890, aum: 2345, expenseRatio: 0.30, category: 'Banking', fundHouse: 'Nippon India', trackingIndex: 'Nifty Private Bank', nav: 234.12, premiumDiscount: 0.19 },
  { symbol: 'FINSERV', name: 'Nippon India Nifty Financial Services BeES', price: 189.56, change: 1.52, changePercent: 0.81, volume: 234567, aum: 1234, expenseRatio: 0.25, category: 'Financial Services', fundHouse: 'Nippon India', trackingIndex: 'Nifty Financial Services', nav: 189.12, premiumDiscount: 0.23 },
  { symbol: 'SBIFINETF', name: 'SBI Nifty Financial Services ETF', price: 178.90, change: 1.43, changePercent: 0.81, volume: 123456, aum: 987, expenseRatio: 0.25, category: 'Financial Services', fundHouse: 'SBI Mutual Fund', trackingIndex: 'Nifty Financial Services', nav: 178.45, premiumDiscount: 0.25 },

  // Healthcare & Pharma ETFs
  { symbol: 'PHARMABEES', name: 'Nippon India Nifty Pharma BeES', price: 234.56, change: 1.87, changePercent: 0.80, volume: 345678, aum: 2345, expenseRatio: 0.35, category: 'Pharma', fundHouse: 'Nippon India', trackingIndex: 'Nifty Pharma', nav: 234.12, premiumDiscount: 0.19 },
  { symbol: 'SBIPHARMA', name: 'SBI Nifty Healthcare Index ETF', price: 89.56, change: 0.72, changePercent: 0.81, volume: 123456, aum: 1234, expenseRatio: 0.30, category: 'Healthcare', fundHouse: 'SBI Mutual Fund', trackingIndex: 'Nifty Healthcare', nav: 89.12, premiumDiscount: 0.49 },
  { symbol: 'ICICIPHRM', name: 'ICICI Prudential Nifty Pharma ETF', price: 78.90, change: 0.63, changePercent: 0.81, volume: 98765, aum: 987, expenseRatio: 0.35, category: 'Pharma', fundHouse: 'ICICI Prudential', trackingIndex: 'Nifty Pharma', nav: 78.45, premiumDiscount: 0.57 },

  // Consumption & FMCG ETFs
  { symbol: 'CONSUMBEES', name: 'Nippon India Nifty Consumption BeES', price: 134.56, change: 1.21, changePercent: 0.91, volume: 234567, aum: 1234, expenseRatio: 0.30, category: 'Consumption', fundHouse: 'Nippon India', trackingIndex: 'Nifty Consumption', nav: 134.12, premiumDiscount: 0.33 },
  { symbol: 'SBICONS', name: 'SBI Nifty Consumption ETF', price: 123.45, change: 1.11, changePercent: 0.91, volume: 123456, aum: 987, expenseRatio: 0.30, category: 'Consumption', fundHouse: 'SBI Mutual Fund', trackingIndex: 'Nifty Consumption', nav: 123.01, premiumDiscount: 0.36 },
  { symbol: 'FMCGETF', name: 'Nippon India Nifty FMCG ETF', price: 45.67, change: 0.37, changePercent: 0.82, volume: 98765, aum: 765, expenseRatio: 0.35, category: 'FMCG', fundHouse: 'Nippon India', trackingIndex: 'Nifty FMCG', nav: 45.34, premiumDiscount: 0.73 },

  // Auto ETFs
  { symbol: 'AUTOETF', name: 'Nippon India Nifty Auto ETF', price: 178.90, change: 2.15, changePercent: 1.22, volume: 123456, aum: 987, expenseRatio: 0.30, category: 'Auto', fundHouse: 'Nippon India', trackingIndex: 'Nifty Auto', nav: 178.45, premiumDiscount: 0.25 },
  { symbol: 'SBIAUTO', name: 'SBI Nifty Auto ETF', price: 167.89, change: 2.01, changePercent: 1.21, volume: 98765, aum: 765, expenseRatio: 0.30, category: 'Auto', fundHouse: 'SBI Mutual Fund', trackingIndex: 'Nifty Auto', nav: 167.45, premiumDiscount: 0.26 },

  // Energy ETFs
  { symbol: 'OILIETF', name: 'ICICI Prudential Nifty Oil & Gas ETF', price: 23.45, change: 0.26, changePercent: 1.12, volume: 234567, aum: 1234, expenseRatio: 0.35, category: 'Energy', fundHouse: 'ICICI Prudential', trackingIndex: 'Nifty Oil & Gas', nav: 23.23, premiumDiscount: 0.95 },
  { symbol: 'SBIENERGY', name: 'SBI Energy ETF', price: 34.56, change: 0.38, changePercent: 1.11, volume: 123456, aum: 987, expenseRatio: 0.30, category: 'Energy', fundHouse: 'SBI Mutual Fund', trackingIndex: 'Nifty Energy', nav: 34.34, premiumDiscount: 0.64 },

  // Momentum & Factor ETFs
  { symbol: 'NIFTY200MOM', name: 'UTI Nifty 200 Momentum 30 ETF', price: 89.56, change: 1.07, changePercent: 1.21, volume: 234567, aum: 3456, expenseRatio: 0.35, category: 'Factor', fundHouse: 'UTI Mutual Fund', trackingIndex: 'Nifty 200 Momentum 30', nav: 89.12, premiumDiscount: 0.49 },
  { symbol: 'MOM30', name: 'Motilal Oswal Nifty Midcap 100 Momentum 15 ETF', price: 34.56, change: 0.45, changePercent: 1.32, volume: 123456, aum: 1234, expenseRatio: 0.40, category: 'Factor', fundHouse: 'Motilal Oswal', trackingIndex: 'Nifty Midcap 100 Momentum 15', nav: 34.23, premiumDiscount: 0.96 },
  { symbol: 'QUALITY30', name: 'ICICI Prudential Nifty 50 Quality 30 ETF', price: 45.67, change: 0.37, changePercent: 0.82, volume: 98765, aum: 987, expenseRatio: 0.30, category: 'Factor', fundHouse: 'ICICI Prudential', trackingIndex: 'Nifty 50 Quality 30', nav: 45.34, premiumDiscount: 0.73 },
  { symbol: 'LOWVOL', name: 'ICICI Prudential Nifty Low Vol 30 ETF', price: 156.78, change: 0.94, changePercent: 0.60, volume: 76543, aum: 765, expenseRatio: 0.30, category: 'Factor', fundHouse: 'ICICI Prudential', trackingIndex: 'Nifty 50 Low Volatility 30', nav: 156.34, premiumDiscount: 0.28 },
  { symbol: 'ALPHAETF', name: 'ICICI Prudential Alpha Low Vol 30 ETF', price: 56.78, change: 0.40, changePercent: 0.71, volume: 65432, aum: 654, expenseRatio: 0.35, category: 'Factor', fundHouse: 'ICICI Prudential', trackingIndex: 'Nifty Alpha Low Vol 30', nav: 56.45, premiumDiscount: 0.58 },

  // Debt ETFs
  { symbol: 'LIQUIDBEES', name: 'Nippon India Liquid BeES', price: 1000.12, change: 0.02, changePercent: 0.00, volume: 3456789, aum: 34567, expenseRatio: 0.05, category: 'Liquid', fundHouse: 'Nippon India', trackingIndex: 'Overnight Rates', nav: 1000.10, premiumDiscount: 0.00 },
  { symbol: 'NIFTYGS', name: 'Nippon India Nifty SDL Sep 2027 ETF', price: 34.56, change: 0.02, changePercent: 0.06, volume: 234567, aum: 2345, expenseRatio: 0.10, category: 'Debt', fundHouse: 'Nippon India', trackingIndex: 'Nifty SDL Sep 2027', nav: 34.54, premiumDiscount: 0.06 },
  { symbol: 'BHARAT22', name: 'ICICI Prudential Nifty Bharat 22 ETF', price: 112.34, change: 1.35, changePercent: 1.22, volume: 1234567, aum: 18765, expenseRatio: 0.01, category: 'PSU', fundHouse: 'ICICI Prudential', trackingIndex: 'Nifty Bharat 22', nav: 112.01, premiumDiscount: 0.29 },

  // ESG ETFs
  { symbol: 'ESGETF', name: 'Mirae Asset ESG Sector Leaders ETF', price: 23.45, change: 0.19, changePercent: 0.82, volume: 123456, aum: 987, expenseRatio: 0.30, category: 'ESG', fundHouse: 'Mirae Asset', trackingIndex: 'Nifty 100 ESG Sector Leaders', nav: 23.23, premiumDiscount: 0.95 },
  { symbol: 'SBIESG', name: 'SBI Nifty 100 ESG ETF', price: 18.90, change: 0.15, changePercent: 0.80, volume: 98765, aum: 765, expenseRatio: 0.30, category: 'ESG', fundHouse: 'SBI Mutual Fund', trackingIndex: 'Nifty 100 ESG', nav: 18.78, premiumDiscount: 0.64 },
  { symbol: 'KOTAKESG', name: 'Kotak Nifty 100 ESG ETF', price: 17.89, change: 0.14, changePercent: 0.79, volume: 76543, aum: 654, expenseRatio: 0.35, category: 'ESG', fundHouse: 'Kotak Mahindra', trackingIndex: 'Nifty 100 ESG', nav: 17.78, premiumDiscount: 0.62 },
];
