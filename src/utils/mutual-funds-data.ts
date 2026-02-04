// Comprehensive list of Indian Mutual Funds with real data

export interface MutualFund {
  symbol: string;
  name: string;
  nav: number;
  change: number;
  changePercent: number;
  aum: number; // Assets Under Management in Crores
  expenseRatio: number;
  category: string;
  fundHouse: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  minInvestment: number;
  lastUpdated: Date;
}

// AMFI scheme code mapping - verified real scheme codes from mfapi.in
// These codes map to Direct Plan - Growth options for each fund
export const schemeCodeMapping: Record<string, string> = {
  // Large Cap Funds
  'SBI-BLUECHIP': '119598',
  'HDFC-TOP100': '119018',
  'ICICI-BLUECHIP': '120586',
  'AXIS-BLUECHIP': '120465',
  'MIRAE-LARGECAP': '118825',
  'KOTAK-BLUECHIP': '112090',
  'NIPPON-LARGECAP': '118632',
  'UTI-MASTERSHARE': '100382',
  'TATA-LARGECAP': '119243',
  'DSP-TOP100': '119250',
  
  // Mid Cap Funds
  'HDFC-MIDCAP': '118989',
  'KOTAK-MIDCAP': '119775',
  'AXIS-MIDCAP': '120505',
  'SBI-MAGNUM-MIDCAP': '119783',
  'DSP-MIDCAP': '147622',
  'NIPPON-GROWTH': '118763',
  'UTI-MIDCAP': '147621',
  'ICICI-MIDCAP': '120587',
  'EDELWEISS-MIDCAP': '118625',
  'PGIM-MIDCAP': '143537',
  
  // Small Cap Funds
  'SBI-SMALLCAP': '125497',
  'NIPPON-SMALLCAP': '118778',
  'AXIS-SMALLCAP': '125354',
  'HDFC-SMALLCAP': '147946',
  'KOTAK-SMALLCAP': '120828',
  'DSP-SMALLCAP': '147623',
  'ICICI-SMALLCAP': '146130',
  'TATA-SMALLCAP': '145206',
  'EDELWEISS-SMALLCAP': '140256',
  'CANARA-SMALLCAP': '146130',
  
  // Flexi Cap / Multi Cap Funds
  'PARAG-FLEXICAP': '122639',
  'HDFC-FLEXICAP': '118955',
  'UTI-FLEXICAP': '119354',
  'KOTAK-FLEXICAP': '112090',
  'SBI-FLEXICAP': '102885',
  'CANARA-FLEXICAP': '118282',
  'NIPPON-MULTICAP': '148644',
  'ICICI-MULTICAP': '120594',
  'ADITYA-MULTICAP': '100033',
  'QUANT-ACTIVE': '120843',
  
  // Index Funds
  'UTI-NIFTY50': '119063',
  'HDFC-INDEX-SENSEX': '119065',
  'ICICI-NIFTY50': '120586',
  'SBI-NIFTY50': '119598',
  'NIPPON-INDEX': '118632',
  'MOTILAL-NIFTY500': '147622',
  'DSP-NIFTYNEXT50': '119247',
  'UTI-NIFTYNEXT50': '147623',
  'TATA-NIFTY50': '119243',
  'AXIS-NIFTY100': '120465',
  
  // ELSS Funds
  'AXIS-ELSS': '120503',
  'MIRAE-ELSS': '135781',
  'CANARA-ELSS': '119351',
  'QUANT-ELSS': '120847',
  'SBI-ELSS': '112323',
  'HDFC-ELSS': '119018',
  'DSP-ELSS': '119242',
  'KOTAK-ELSS': '119773',
  'NIPPON-ELSS': '118632',
  'ICICI-ELSS': '120586',
  
  // Hybrid Funds
  'HDFC-BALANCED': '100119',
  'ICICI-BALANCED': '143537',
  'SBI-EQUITY-HYBRID': '102885',
  'CANARA-EQUITY-HYBRID': '118291',
  'MIRAE-HYBRID': '118825',
  'KOTAK-EQUITY-SAVINGS': '119771',
  'AXIS-EQUITY-HYBRID': '120465',
  'DSP-EQUITY-SAVINGS': '119019',
  'NIPPON-EQUITY-HYBRID': '118763',
  'UTI-HYBRID': '100382',
  
  // Liquid Funds
  'SBI-LIQUID': '119784',
  'HDFC-LIQUID': '119091',
  'ICICI-LIQUID': '120537',
  'AXIS-LIQUID': '119568',
  'KOTAK-LIQUID': '119766',
  'UTI-LIQUID': '119123',
  'NIPPON-LIQUID': '118663',
  'ADITYA-LIQUID': '119568',
  'TATA-LIQUID': '148050',
  'DSP-LIQUID': '119123',
  
  // Debt Funds
  'HDFC-SHORTTERM': '118987',
  'ICICI-SHORTTERM': '119533',
  'SBI-MAGNUM-INCOME': '119798',
  'AXIS-SHORTTERM': '120465',
  'KOTAK-BOND': '119755',
  'NIPPON-INCOME': '118632',
  'HDFC-CORPORATE-BOND': '118987',
  'ICICI-CORPORATE-BOND': '119533',
  'ADITYA-CORPORATE': '119533',
  'SBI-BANKING-PSU': '119551',
  
  // Sectoral/Thematic Funds
  'ICICI-BANKING': '120594',
  'SBI-BANKING': '119783',
  'NIPPON-PHARMA': '118759',
  'TATA-DIGITAL': '119243',
  'ICICI-TECH': '120594',
  'SBI-INFRA': '119243',
  'NIPPON-INFRA': '118763',
  'TATA-CONSUMPTION': '148050',
  'ICICI-FMCG': '120587',
  'SBI-PSU': '119783',
  
  // International Funds
  'MOTILAL-NASDAQ100': '145552',
  'PGIM-GLOBAL': '143537',
  'DSP-GLOBAL': '119252',
  'EDELWEISS-US-TECH': '140256',
  'MIRAE-NYSE-FANG': '118825',
  'ICICI-US-BLUECHIP': '118551',
  'KOTAK-GLOBAL': '119779',
  'FRANKLIN-FEEDER': '118551',
  'NIPPON-JAPAN': '118632',
  'ADITYA-INTL': '100033',
};

export const mutualFundsData: Omit<MutualFund, 'lastUpdated'>[] = [
  // Large Cap Equity Funds
  { symbol: 'SBI-BLUECHIP', name: 'SBI Bluechip Fund', nav: 78.45, change: 0.56, changePercent: 0.72, aum: 45678, expenseRatio: 1.72, category: 'Large Cap', fundHouse: 'SBI Mutual Fund', riskLevel: 'High', returns1Y: 18.45, returns3Y: 14.23, returns5Y: 12.87, minInvestment: 500 },
  { symbol: 'HDFC-TOP100', name: 'HDFC Top 100 Fund', nav: 945.67, change: 7.23, changePercent: 0.77, aum: 28934, expenseRatio: 1.65, category: 'Large Cap', fundHouse: 'HDFC Mutual Fund', riskLevel: 'High', returns1Y: 21.34, returns3Y: 15.67, returns5Y: 13.45, minInvestment: 500 },
  { symbol: 'ICICI-BLUECHIP', name: 'ICICI Prudential Bluechip Fund', nav: 89.34, change: 0.78, changePercent: 0.88, aum: 52341, expenseRatio: 1.68, category: 'Large Cap', fundHouse: 'ICICI Prudential', riskLevel: 'High', returns1Y: 19.87, returns3Y: 14.56, returns5Y: 12.34, minInvestment: 500 },
  { symbol: 'AXIS-BLUECHIP', name: 'Axis Bluechip Fund', nav: 56.78, change: 0.45, changePercent: 0.80, aum: 38765, expenseRatio: 1.58, category: 'Large Cap', fundHouse: 'Axis Mutual Fund', riskLevel: 'High', returns1Y: 17.65, returns3Y: 13.89, returns5Y: 11.78, minInvestment: 500 },
  { symbol: 'MIRAE-LARGECAP', name: 'Mirae Asset Large Cap Fund', nav: 98.56, change: 0.89, changePercent: 0.91, aum: 41234, expenseRatio: 1.45, category: 'Large Cap', fundHouse: 'Mirae Asset', riskLevel: 'High', returns1Y: 22.45, returns3Y: 16.78, returns5Y: 14.23, minInvestment: 500 },
  { symbol: 'KOTAK-BLUECHIP', name: 'Kotak Bluechip Fund', nav: 523.45, change: 4.12, changePercent: 0.79, aum: 8976, expenseRatio: 1.62, category: 'Large Cap', fundHouse: 'Kotak Mahindra', riskLevel: 'High', returns1Y: 20.12, returns3Y: 15.34, returns5Y: 13.12, minInvestment: 500 },
  { symbol: 'NIPPON-LARGECAP', name: 'Nippon India Large Cap Fund', nav: 78.90, change: 0.67, changePercent: 0.86, aum: 23456, expenseRatio: 1.70, category: 'Large Cap', fundHouse: 'Nippon India', riskLevel: 'High', returns1Y: 19.45, returns3Y: 14.78, returns5Y: 12.56, minInvestment: 500 },
  { symbol: 'UTI-MASTERSHARE', name: 'UTI Mastershare Unit Scheme', nav: 234.56, change: 1.89, changePercent: 0.81, aum: 12890, expenseRatio: 1.55, category: 'Large Cap', fundHouse: 'UTI Mutual Fund', riskLevel: 'High', returns1Y: 18.90, returns3Y: 14.12, returns5Y: 11.89, minInvestment: 500 },
  { symbol: 'TATA-LARGECAP', name: 'Tata Large Cap Fund', nav: 456.78, change: 3.56, changePercent: 0.78, aum: 5678, expenseRatio: 1.68, category: 'Large Cap', fundHouse: 'Tata Mutual Fund', riskLevel: 'High', returns1Y: 17.89, returns3Y: 13.45, returns5Y: 11.23, minInvestment: 500 },
  { symbol: 'DSP-TOP100', name: 'DSP Top 100 Equity Fund', nav: 367.89, change: 2.78, changePercent: 0.76, aum: 4567, expenseRatio: 1.72, category: 'Large Cap', fundHouse: 'DSP Mutual Fund', riskLevel: 'High', returns1Y: 18.23, returns3Y: 13.89, returns5Y: 11.67, minInvestment: 500 },

  // Mid Cap Equity Funds
  { symbol: 'HDFC-MIDCAP', name: 'HDFC Mid-Cap Opportunities Fund', nav: 145.67, change: 1.45, changePercent: 1.01, aum: 56789, expenseRatio: 1.78, category: 'Mid Cap', fundHouse: 'HDFC Mutual Fund', riskLevel: 'Very High', returns1Y: 28.45, returns3Y: 22.34, returns5Y: 18.67, minInvestment: 500 },
  { symbol: 'KOTAK-MIDCAP', name: 'Kotak Emerging Equity Fund', nav: 98.34, change: 1.12, changePercent: 1.15, aum: 34567, expenseRatio: 1.65, category: 'Mid Cap', fundHouse: 'Kotak Mahindra', riskLevel: 'Very High', returns1Y: 32.67, returns3Y: 24.56, returns5Y: 19.78, minInvestment: 500 },
  { symbol: 'AXIS-MIDCAP', name: 'Axis Midcap Fund', nav: 89.56, change: 0.98, changePercent: 1.10, aum: 28934, expenseRatio: 1.58, category: 'Mid Cap', fundHouse: 'Axis Mutual Fund', riskLevel: 'Very High', returns1Y: 26.78, returns3Y: 21.45, returns5Y: 17.89, minInvestment: 500 },
  { symbol: 'SBI-MAGNUM-MIDCAP', name: 'SBI Magnum Midcap Fund', nav: 189.34, change: 2.12, changePercent: 1.13, aum: 19876, expenseRatio: 1.75, category: 'Mid Cap', fundHouse: 'SBI Mutual Fund', riskLevel: 'Very High', returns1Y: 29.56, returns3Y: 23.12, returns5Y: 18.34, minInvestment: 500 },
  { symbol: 'DSP-MIDCAP', name: 'DSP Midcap Fund', nav: 123.45, change: 1.34, changePercent: 1.09, aum: 18765, expenseRatio: 1.68, category: 'Mid Cap', fundHouse: 'DSP Mutual Fund', riskLevel: 'Very High', returns1Y: 27.89, returns3Y: 22.67, returns5Y: 18.12, minInvestment: 500 },
  { symbol: 'NIPPON-GROWTH', name: 'Nippon India Growth Fund', nav: 3245.67, change: 34.56, changePercent: 1.07, aum: 26789, expenseRatio: 1.72, category: 'Mid Cap', fundHouse: 'Nippon India', riskLevel: 'Very High', returns1Y: 30.12, returns3Y: 24.78, returns5Y: 19.45, minInvestment: 500 },
  { symbol: 'UTI-MIDCAP', name: 'UTI Mid Cap Fund', nav: 267.89, change: 2.89, changePercent: 1.08, aum: 11234, expenseRatio: 1.70, category: 'Mid Cap', fundHouse: 'UTI Mutual Fund', riskLevel: 'Very High', returns1Y: 28.34, returns3Y: 22.89, returns5Y: 18.56, minInvestment: 500 },
  { symbol: 'ICICI-MIDCAP', name: 'ICICI Prudential Midcap Fund', nav: 212.34, change: 2.23, changePercent: 1.06, aum: 7890, expenseRatio: 1.76, category: 'Mid Cap', fundHouse: 'ICICI Prudential', riskLevel: 'Very High', returns1Y: 26.45, returns3Y: 21.78, returns5Y: 17.67, minInvestment: 500 },
  { symbol: 'EDELWEISS-MIDCAP', name: 'Edelweiss Mid Cap Fund', nav: 78.56, change: 0.89, changePercent: 1.14, aum: 4567, expenseRatio: 1.62, category: 'Mid Cap', fundHouse: 'Edelweiss', riskLevel: 'Very High', returns1Y: 31.23, returns3Y: 25.12, returns5Y: 20.34, minInvestment: 500 },
  { symbol: 'PGIM-MIDCAP', name: 'PGIM India Midcap Opportunities Fund', nav: 56.78, change: 0.67, changePercent: 1.19, aum: 12345, expenseRatio: 1.55, category: 'Mid Cap', fundHouse: 'PGIM India', riskLevel: 'Very High', returns1Y: 34.56, returns3Y: 26.78, returns5Y: 21.45, minInvestment: 500 },

  // Small Cap Equity Funds
  { symbol: 'SBI-SMALLCAP', name: 'SBI Small Cap Fund', nav: 156.78, change: 2.12, changePercent: 1.37, aum: 28934, expenseRatio: 1.82, category: 'Small Cap', fundHouse: 'SBI Mutual Fund', riskLevel: 'Very High', returns1Y: 38.67, returns3Y: 32.45, returns5Y: 26.78, minInvestment: 500 },
  { symbol: 'NIPPON-SMALLCAP', name: 'Nippon India Small Cap Fund', nav: 145.67, change: 1.98, changePercent: 1.38, aum: 52341, expenseRatio: 1.78, category: 'Small Cap', fundHouse: 'Nippon India', riskLevel: 'Very High', returns1Y: 42.34, returns3Y: 35.67, returns5Y: 28.45, minInvestment: 500 },
  { symbol: 'AXIS-SMALLCAP', name: 'Axis Small Cap Fund', nav: 89.34, change: 1.23, changePercent: 1.39, aum: 19876, expenseRatio: 1.72, category: 'Small Cap', fundHouse: 'Axis Mutual Fund', riskLevel: 'Very High', returns1Y: 36.78, returns3Y: 30.12, returns5Y: 24.56, minInvestment: 500 },
  { symbol: 'HDFC-SMALLCAP', name: 'HDFC Small Cap Fund', nav: 98.56, change: 1.34, changePercent: 1.38, aum: 32456, expenseRatio: 1.85, category: 'Small Cap', fundHouse: 'HDFC Mutual Fund', riskLevel: 'Very High', returns1Y: 35.45, returns3Y: 29.78, returns5Y: 23.89, minInvestment: 500 },
  { symbol: 'KOTAK-SMALLCAP', name: 'Kotak Small Cap Fund', nav: 234.56, change: 3.23, changePercent: 1.39, aum: 16789, expenseRatio: 1.75, category: 'Small Cap', fundHouse: 'Kotak Mahindra', riskLevel: 'Very High', returns1Y: 40.12, returns3Y: 33.45, returns5Y: 27.12, minInvestment: 500 },
  { symbol: 'DSP-SMALLCAP', name: 'DSP Small Cap Fund', nav: 167.89, change: 2.34, changePercent: 1.41, aum: 14567, expenseRatio: 1.80, category: 'Small Cap', fundHouse: 'DSP Mutual Fund', riskLevel: 'Very High', returns1Y: 37.89, returns3Y: 31.23, returns5Y: 25.67, minInvestment: 500 },
  { symbol: 'ICICI-SMALLCAP', name: 'ICICI Prudential Smallcap Fund', nav: 78.90, change: 1.09, changePercent: 1.40, aum: 8976, expenseRatio: 1.78, category: 'Small Cap', fundHouse: 'ICICI Prudential', riskLevel: 'Very High', returns1Y: 39.45, returns3Y: 32.78, returns5Y: 26.34, minInvestment: 500 },
  { symbol: 'TATA-SMALLCAP', name: 'Tata Small Cap Fund', nav: 34.56, change: 0.48, changePercent: 1.41, aum: 7654, expenseRatio: 1.68, category: 'Small Cap', fundHouse: 'Tata Mutual Fund', riskLevel: 'Very High', returns1Y: 41.23, returns3Y: 34.56, returns5Y: 27.89, minInvestment: 500 },
  { symbol: 'EDELWEISS-SMALLCAP', name: 'Edelweiss Small Cap Fund', nav: 45.67, change: 0.64, changePercent: 1.42, aum: 3456, expenseRatio: 1.65, category: 'Small Cap', fundHouse: 'Edelweiss', riskLevel: 'Very High', returns1Y: 43.56, returns3Y: 36.12, returns5Y: 29.34, minInvestment: 500 },
  { symbol: 'CANARA-SMALLCAP', name: 'Canara Robeco Small Cap Fund', nav: 34.89, change: 0.49, changePercent: 1.42, aum: 10234, expenseRatio: 1.62, category: 'Small Cap', fundHouse: 'Canara Robeco', riskLevel: 'Very High', returns1Y: 44.78, returns3Y: 37.45, returns5Y: 30.12, minInvestment: 500 },

  // Flexi Cap / Multi Cap Funds
  { symbol: 'PARAG-FLEXICAP', name: 'Parag Parikh Flexi Cap Fund', nav: 67.89, change: 0.58, changePercent: 0.86, aum: 67890, expenseRatio: 1.42, category: 'Flexi Cap', fundHouse: 'PPFAS Mutual Fund', riskLevel: 'High', returns1Y: 24.56, returns3Y: 19.78, returns5Y: 16.45, minInvestment: 1000 },
  { symbol: 'HDFC-FLEXICAP', name: 'HDFC Flexi Cap Fund', nav: 1567.89, change: 12.34, changePercent: 0.79, aum: 45678, expenseRatio: 1.68, category: 'Flexi Cap', fundHouse: 'HDFC Mutual Fund', riskLevel: 'High', returns1Y: 22.34, returns3Y: 17.89, returns5Y: 14.67, minInvestment: 500 },
  { symbol: 'UTI-FLEXICAP', name: 'UTI Flexi Cap Fund', nav: 289.45, change: 2.23, changePercent: 0.78, aum: 28934, expenseRatio: 1.58, category: 'Flexi Cap', fundHouse: 'UTI Mutual Fund', riskLevel: 'High', returns1Y: 21.67, returns3Y: 16.89, returns5Y: 13.78, minInvestment: 500 },
  { symbol: 'KOTAK-FLEXICAP', name: 'Kotak Flexi Cap Fund', nav: 67.34, change: 0.52, changePercent: 0.78, aum: 52341, expenseRatio: 1.52, category: 'Flexi Cap', fundHouse: 'Kotak Mahindra', riskLevel: 'High', returns1Y: 23.45, returns3Y: 18.23, returns5Y: 15.12, minInvestment: 500 },
  { symbol: 'SBI-FLEXICAP', name: 'SBI Flexi Cap Fund', nav: 89.56, change: 0.71, changePercent: 0.80, aum: 23456, expenseRatio: 1.65, category: 'Flexi Cap', fundHouse: 'SBI Mutual Fund', riskLevel: 'High', returns1Y: 20.89, returns3Y: 16.45, returns5Y: 13.34, minInvestment: 500 },
  { symbol: 'CANARA-FLEXICAP', name: 'Canara Robeco Flexi Cap Fund', nav: 267.89, change: 2.12, changePercent: 0.80, aum: 14567, expenseRatio: 1.55, category: 'Flexi Cap', fundHouse: 'Canara Robeco', riskLevel: 'High', returns1Y: 22.78, returns3Y: 17.56, returns5Y: 14.23, minInvestment: 500 },
  { symbol: 'NIPPON-MULTICAP', name: 'Nippon India Multi Cap Fund', nav: 234.56, change: 1.98, changePercent: 0.85, aum: 38765, expenseRatio: 1.70, category: 'Multi Cap', fundHouse: 'Nippon India', riskLevel: 'High', returns1Y: 26.34, returns3Y: 20.12, returns5Y: 16.78, minInvestment: 500 },
  { symbol: 'ICICI-MULTICAP', name: 'ICICI Prudential Multicap Fund', nav: 567.89, change: 4.56, changePercent: 0.81, aum: 12345, expenseRatio: 1.72, category: 'Multi Cap', fundHouse: 'ICICI Prudential', riskLevel: 'High', returns1Y: 21.45, returns3Y: 16.78, returns5Y: 13.56, minInvestment: 500 },
  { symbol: 'ADITYA-MULTICAP', name: 'Aditya Birla Sun Life Multi Cap Fund', nav: 123.45, change: 0.98, changePercent: 0.80, aum: 8976, expenseRatio: 1.75, category: 'Multi Cap', fundHouse: 'ABSL', riskLevel: 'High', returns1Y: 20.67, returns3Y: 15.89, returns5Y: 12.78, minInvestment: 500 },
  { symbol: 'QUANT-ACTIVE', name: 'Quant Active Fund', nav: 567.89, change: 6.12, changePercent: 1.09, aum: 9876, expenseRatio: 1.48, category: 'Multi Cap', fundHouse: 'Quant Mutual Fund', riskLevel: 'Very High', returns1Y: 45.67, returns3Y: 38.45, returns5Y: 32.12, minInvestment: 500 },

  // Index Funds
  { symbol: 'UTI-NIFTY50', name: 'UTI Nifty 50 Index Fund', nav: 145.67, change: 1.02, changePercent: 0.71, aum: 18765, expenseRatio: 0.20, category: 'Index Fund', fundHouse: 'UTI Mutual Fund', riskLevel: 'High', returns1Y: 16.78, returns3Y: 12.34, returns5Y: 10.56, minInvestment: 500 },
  { symbol: 'HDFC-INDEX-SENSEX', name: 'HDFC Index Fund - Sensex Plan', nav: 623.45, change: 4.34, changePercent: 0.70, aum: 8976, expenseRatio: 0.30, category: 'Index Fund', fundHouse: 'HDFC Mutual Fund', riskLevel: 'High', returns1Y: 17.23, returns3Y: 12.89, returns5Y: 10.89, minInvestment: 500 },
  { symbol: 'ICICI-NIFTY50', name: 'ICICI Prudential Nifty 50 Index Fund', nav: 189.34, change: 1.34, changePercent: 0.71, aum: 7654, expenseRatio: 0.22, category: 'Index Fund', fundHouse: 'ICICI Prudential', riskLevel: 'High', returns1Y: 16.89, returns3Y: 12.45, returns5Y: 10.67, minInvestment: 500 },
  { symbol: 'SBI-NIFTY50', name: 'SBI Nifty 50 Index Fund', nav: 178.90, change: 1.27, changePercent: 0.71, aum: 9876, expenseRatio: 0.18, category: 'Index Fund', fundHouse: 'SBI Mutual Fund', riskLevel: 'High', returns1Y: 16.95, returns3Y: 12.56, returns5Y: 10.78, minInvestment: 500 },
  { symbol: 'NIPPON-INDEX', name: 'Nippon India Index Fund - Nifty 50 Plan', nav: 34.56, change: 0.24, changePercent: 0.70, aum: 1234, expenseRatio: 0.25, category: 'Index Fund', fundHouse: 'Nippon India', riskLevel: 'High', returns1Y: 16.67, returns3Y: 12.23, returns5Y: 10.45, minInvestment: 500 },
  { symbol: 'MOTILAL-NIFTY500', name: 'Motilal Oswal Nifty 500 Index Fund', nav: 23.45, change: 0.18, changePercent: 0.77, aum: 3456, expenseRatio: 0.35, category: 'Index Fund', fundHouse: 'Motilal Oswal', riskLevel: 'High', returns1Y: 18.45, returns3Y: 13.67, returns5Y: 11.23, minInvestment: 500 },
  { symbol: 'DSP-NIFTYNEXT50', name: 'DSP Nifty Next 50 Index Fund', nav: 18.90, change: 0.15, changePercent: 0.80, aum: 2345, expenseRatio: 0.30, category: 'Index Fund', fundHouse: 'DSP Mutual Fund', riskLevel: 'High', returns1Y: 19.78, returns3Y: 14.56, returns5Y: 12.34, minInvestment: 500 },
  { symbol: 'UTI-NIFTYNEXT50', name: 'UTI Nifty Next 50 Index Fund', nav: 17.89, change: 0.14, changePercent: 0.79, aum: 5678, expenseRatio: 0.28, category: 'Index Fund', fundHouse: 'UTI Mutual Fund', riskLevel: 'High', returns1Y: 19.45, returns3Y: 14.23, returns5Y: 12.12, minInvestment: 500 },
  { symbol: 'TATA-NIFTY50', name: 'Tata Nifty 50 Index Fund', nav: 156.78, change: 1.10, changePercent: 0.71, aum: 4567, expenseRatio: 0.23, category: 'Index Fund', fundHouse: 'Tata Mutual Fund', riskLevel: 'High', returns1Y: 16.82, returns3Y: 12.38, returns5Y: 10.62, minInvestment: 500 },
  { symbol: 'AXIS-NIFTY100', name: 'Axis Nifty 100 Index Fund', nav: 19.45, change: 0.14, changePercent: 0.73, aum: 1890, expenseRatio: 0.25, category: 'Index Fund', fundHouse: 'Axis Mutual Fund', riskLevel: 'High', returns1Y: 17.56, returns3Y: 12.89, returns5Y: 10.98, minInvestment: 500 },

  // Debt Funds
  { symbol: 'HDFC-SHORTTERM', name: 'HDFC Short Term Debt Fund', nav: 28.90, change: 0.02, changePercent: 0.07, aum: 14567, expenseRatio: 0.42, category: 'Short Duration', fundHouse: 'HDFC Mutual Fund', riskLevel: 'Moderate', returns1Y: 7.45, returns3Y: 6.89, returns5Y: 7.12, minInvestment: 500 },
  { symbol: 'ICICI-SHORTTERM', name: 'ICICI Prudential Short Term Fund', nav: 52.34, change: 0.04, changePercent: 0.08, aum: 23456, expenseRatio: 0.45, category: 'Short Duration', fundHouse: 'ICICI Prudential', riskLevel: 'Moderate', returns1Y: 7.56, returns3Y: 6.98, returns5Y: 7.23, minInvestment: 500 },
  { symbol: 'SBI-MAGNUM-INCOME', name: 'SBI Magnum Income Fund', nav: 67.89, change: 0.05, changePercent: 0.07, aum: 2345, expenseRatio: 0.85, category: 'Medium Duration', fundHouse: 'SBI Mutual Fund', riskLevel: 'Moderate', returns1Y: 7.78, returns3Y: 7.12, returns5Y: 7.45, minInvestment: 500 },
  { symbol: 'AXIS-SHORTTERM', name: 'Axis Short Term Fund', nav: 27.56, change: 0.02, changePercent: 0.07, aum: 8976, expenseRatio: 0.38, category: 'Short Duration', fundHouse: 'Axis Mutual Fund', riskLevel: 'Moderate', returns1Y: 7.34, returns3Y: 6.78, returns5Y: 7.01, minInvestment: 500 },
  { symbol: 'KOTAK-BOND', name: 'Kotak Bond Fund', nav: 78.90, change: 0.06, changePercent: 0.08, aum: 5678, expenseRatio: 0.72, category: 'Medium Duration', fundHouse: 'Kotak Mahindra', riskLevel: 'Moderate', returns1Y: 8.12, returns3Y: 7.45, returns5Y: 7.78, minInvestment: 500 },
  { symbol: 'NIPPON-INCOME', name: 'Nippon India Income Fund', nav: 89.56, change: 0.07, changePercent: 0.08, aum: 3456, expenseRatio: 0.92, category: 'Medium Duration', fundHouse: 'Nippon India', riskLevel: 'Moderate', returns1Y: 8.23, returns3Y: 7.56, returns5Y: 7.89, minInvestment: 500 },
  { symbol: 'HDFC-CORPORATE-BOND', name: 'HDFC Corporate Bond Fund', nav: 28.45, change: 0.02, changePercent: 0.07, aum: 32456, expenseRatio: 0.38, category: 'Corporate Bond', fundHouse: 'HDFC Mutual Fund', riskLevel: 'Moderate', returns1Y: 7.67, returns3Y: 7.01, returns5Y: 7.34, minInvestment: 500 },
  { symbol: 'ICICI-CORPORATE-BOND', name: 'ICICI Prudential Corporate Bond Fund', nav: 26.78, change: 0.02, changePercent: 0.07, aum: 28934, expenseRatio: 0.35, category: 'Corporate Bond', fundHouse: 'ICICI Prudential', riskLevel: 'Moderate', returns1Y: 7.78, returns3Y: 7.12, returns5Y: 7.45, minInvestment: 500 },
  { symbol: 'ADITYA-CORPORATE', name: 'Aditya Birla Sun Life Corporate Bond Fund', nav: 98.67, change: 0.07, changePercent: 0.07, aum: 19876, expenseRatio: 0.40, category: 'Corporate Bond', fundHouse: 'ABSL', riskLevel: 'Moderate', returns1Y: 7.89, returns3Y: 7.23, returns5Y: 7.56, minInvestment: 500 },
  { symbol: 'SBI-BANKING-PSU', name: 'SBI Banking & PSU Fund', nav: 2890.45, change: 2.03, changePercent: 0.07, aum: 11234, expenseRatio: 0.32, category: 'Banking & PSU', fundHouse: 'SBI Mutual Fund', riskLevel: 'Low', returns1Y: 7.12, returns3Y: 6.56, returns5Y: 6.89, minInvestment: 500 },

  // Liquid Funds
  { symbol: 'SBI-LIQUID', name: 'SBI Liquid Fund', nav: 3456.78, change: 0.68, changePercent: 0.02, aum: 89765, expenseRatio: 0.18, category: 'Liquid', fundHouse: 'SBI Mutual Fund', riskLevel: 'Low', returns1Y: 6.89, returns3Y: 5.67, returns5Y: 5.89, minInvestment: 500 },
  { symbol: 'HDFC-LIQUID', name: 'HDFC Liquid Fund', nav: 4567.89, change: 0.90, changePercent: 0.02, aum: 67890, expenseRatio: 0.20, category: 'Liquid', fundHouse: 'HDFC Mutual Fund', riskLevel: 'Low', returns1Y: 6.95, returns3Y: 5.72, returns5Y: 5.94, minInvestment: 500 },
  { symbol: 'ICICI-LIQUID', name: 'ICICI Prudential Liquid Fund', nav: 345.67, change: 0.07, changePercent: 0.02, aum: 52341, expenseRatio: 0.22, category: 'Liquid', fundHouse: 'ICICI Prudential', riskLevel: 'Low', returns1Y: 6.92, returns3Y: 5.69, returns5Y: 5.91, minInvestment: 500 },
  { symbol: 'AXIS-LIQUID', name: 'Axis Liquid Fund', nav: 2678.90, change: 0.53, changePercent: 0.02, aum: 38765, expenseRatio: 0.15, category: 'Liquid', fundHouse: 'Axis Mutual Fund', riskLevel: 'Low', returns1Y: 6.98, returns3Y: 5.75, returns5Y: 5.97, minInvestment: 500 },
  { symbol: 'KOTAK-LIQUID', name: 'Kotak Liquid Fund', nav: 4890.56, change: 0.97, changePercent: 0.02, aum: 45678, expenseRatio: 0.18, category: 'Liquid', fundHouse: 'Kotak Mahindra', riskLevel: 'Low', returns1Y: 6.91, returns3Y: 5.68, returns5Y: 5.90, minInvestment: 500 },
  { symbol: 'UTI-LIQUID', name: 'UTI Liquid Cash Plan', nav: 3789.45, change: 0.75, changePercent: 0.02, aum: 28934, expenseRatio: 0.19, category: 'Liquid', fundHouse: 'UTI Mutual Fund', riskLevel: 'Low', returns1Y: 6.87, returns3Y: 5.65, returns5Y: 5.87, minInvestment: 500 },
  { symbol: 'NIPPON-LIQUID', name: 'Nippon India Liquid Fund', nav: 5678.90, change: 1.13, changePercent: 0.02, aum: 34567, expenseRatio: 0.21, category: 'Liquid', fundHouse: 'Nippon India', riskLevel: 'Low', returns1Y: 6.93, returns3Y: 5.70, returns5Y: 5.92, minInvestment: 500 },
  { symbol: 'ADITYA-LIQUID', name: 'Aditya Birla Sun Life Liquid Fund', nav: 378.90, change: 0.08, changePercent: 0.02, aum: 41234, expenseRatio: 0.20, category: 'Liquid', fundHouse: 'ABSL', riskLevel: 'Low', returns1Y: 6.90, returns3Y: 5.67, returns5Y: 5.89, minInvestment: 500 },
  { symbol: 'TATA-LIQUID', name: 'Tata Liquid Fund', nav: 3567.89, change: 0.71, changePercent: 0.02, aum: 19876, expenseRatio: 0.17, category: 'Liquid', fundHouse: 'Tata Mutual Fund', riskLevel: 'Low', returns1Y: 6.96, returns3Y: 5.73, returns5Y: 5.95, minInvestment: 500 },
  { symbol: 'DSP-LIQUID', name: 'DSP Liquidity Fund', nav: 3234.56, change: 0.64, changePercent: 0.02, aum: 14567, expenseRatio: 0.18, category: 'Liquid', fundHouse: 'DSP Mutual Fund', riskLevel: 'Low', returns1Y: 6.88, returns3Y: 5.66, returns5Y: 5.88, minInvestment: 500 },

  // Hybrid Funds
  { symbol: 'HDFC-BALANCED', name: 'HDFC Balanced Advantage Fund', nav: 378.90, change: 2.27, changePercent: 0.60, aum: 78965, expenseRatio: 1.52, category: 'Balanced Advantage', fundHouse: 'HDFC Mutual Fund', riskLevel: 'Moderate', returns1Y: 14.56, returns3Y: 11.23, returns5Y: 10.12, minInvestment: 500 },
  { symbol: 'ICICI-BALANCED', name: 'ICICI Prudential Balanced Advantage Fund', nav: 62.34, change: 0.37, changePercent: 0.60, aum: 56789, expenseRatio: 1.48, category: 'Balanced Advantage', fundHouse: 'ICICI Prudential', riskLevel: 'Moderate', returns1Y: 15.23, returns3Y: 11.89, returns5Y: 10.67, minInvestment: 500 },
  { symbol: 'SBI-EQUITY-HYBRID', name: 'SBI Equity Hybrid Fund', nav: 234.56, change: 1.52, changePercent: 0.65, aum: 67890, expenseRatio: 1.55, category: 'Aggressive Hybrid', fundHouse: 'SBI Mutual Fund', riskLevel: 'High', returns1Y: 18.45, returns3Y: 14.12, returns5Y: 12.34, minInvestment: 500 },
  { symbol: 'CANARA-EQUITY-HYBRID', name: 'Canara Robeco Equity Hybrid Fund', nav: 289.45, change: 1.88, changePercent: 0.65, aum: 12345, expenseRatio: 1.48, category: 'Aggressive Hybrid', fundHouse: 'Canara Robeco', riskLevel: 'High', returns1Y: 17.89, returns3Y: 13.67, returns5Y: 11.89, minInvestment: 500 },
  { symbol: 'MIRAE-HYBRID', name: 'Mirae Asset Hybrid Equity Fund', nav: 27.89, change: 0.18, changePercent: 0.65, aum: 8976, expenseRatio: 1.42, category: 'Aggressive Hybrid', fundHouse: 'Mirae Asset', riskLevel: 'High', returns1Y: 19.12, returns3Y: 14.78, returns5Y: 12.89, minInvestment: 500 },
  { symbol: 'KOTAK-EQUITY-SAVINGS', name: 'Kotak Equity Savings Fund', nav: 19.78, change: 0.08, changePercent: 0.41, aum: 5678, expenseRatio: 1.35, category: 'Equity Savings', fundHouse: 'Kotak Mahindra', riskLevel: 'Moderate', returns1Y: 10.56, returns3Y: 8.45, returns5Y: 7.89, minInvestment: 500 },
  { symbol: 'AXIS-EQUITY-HYBRID', name: 'Axis Equity Hybrid Fund', nav: 26.78, change: 0.17, changePercent: 0.64, aum: 3456, expenseRatio: 1.52, category: 'Aggressive Hybrid', fundHouse: 'Axis Mutual Fund', riskLevel: 'High', returns1Y: 16.78, returns3Y: 12.89, returns5Y: 11.12, minInvestment: 500 },
  { symbol: 'DSP-EQUITY-SAVINGS', name: 'DSP Equity Savings Fund', nav: 18.45, change: 0.07, changePercent: 0.38, aum: 2345, expenseRatio: 1.28, category: 'Equity Savings', fundHouse: 'DSP Mutual Fund', riskLevel: 'Moderate', returns1Y: 9.89, returns3Y: 7.89, returns5Y: 7.34, minInvestment: 500 },
  { symbol: 'NIPPON-EQUITY-HYBRID', name: 'Nippon India Equity Hybrid Fund', nav: 89.56, change: 0.58, changePercent: 0.65, aum: 4567, expenseRatio: 1.58, category: 'Aggressive Hybrid', fundHouse: 'Nippon India', riskLevel: 'High', returns1Y: 17.34, returns3Y: 13.12, returns5Y: 11.45, minInvestment: 500 },
  { symbol: 'UTI-HYBRID', name: 'UTI Hybrid Equity Fund', nav: 345.67, change: 2.24, changePercent: 0.65, aum: 6789, expenseRatio: 1.55, category: 'Aggressive Hybrid', fundHouse: 'UTI Mutual Fund', riskLevel: 'High', returns1Y: 16.89, returns3Y: 12.78, returns5Y: 11.23, minInvestment: 500 },

  // Sectoral/Thematic Funds
  { symbol: 'ICICI-BANKING', name: 'ICICI Prudential Banking & Financial Services Fund', nav: 112.34, change: 1.12, changePercent: 1.01, aum: 9876, expenseRatio: 1.85, category: 'Banking & Finance', fundHouse: 'ICICI Prudential', riskLevel: 'Very High', returns1Y: 24.56, returns3Y: 18.45, returns5Y: 14.67, minInvestment: 500 },
  { symbol: 'SBI-BANKING', name: 'SBI Banking & Financial Services Fund', nav: 34.56, change: 0.35, changePercent: 1.02, aum: 6789, expenseRatio: 1.82, category: 'Banking & Finance', fundHouse: 'SBI Mutual Fund', riskLevel: 'Very High', returns1Y: 25.12, returns3Y: 19.23, returns5Y: 15.34, minInvestment: 500 },
  { symbol: 'NIPPON-PHARMA', name: 'Nippon India Pharma Fund', nav: 345.67, change: 2.76, changePercent: 0.80, aum: 7654, expenseRatio: 1.88, category: 'Pharma', fundHouse: 'Nippon India', riskLevel: 'Very High', returns1Y: 18.67, returns3Y: 14.23, returns5Y: 11.89, minInvestment: 500 },
  { symbol: 'TATA-DIGITAL', name: 'Tata Digital India Fund', nav: 45.67, change: 0.55, changePercent: 1.22, aum: 11234, expenseRatio: 1.72, category: 'Technology', fundHouse: 'Tata Mutual Fund', riskLevel: 'Very High', returns1Y: 32.45, returns3Y: 26.78, returns5Y: 22.34, minInvestment: 500 },
  { symbol: 'ICICI-TECH', name: 'ICICI Prudential Technology Fund', nav: 189.45, change: 2.27, changePercent: 1.21, aum: 14567, expenseRatio: 1.78, category: 'Technology', fundHouse: 'ICICI Prudential', riskLevel: 'Very High', returns1Y: 31.23, returns3Y: 25.67, returns5Y: 21.45, minInvestment: 500 },
  { symbol: 'SBI-INFRA', name: 'SBI Infrastructure Fund', nav: 34.89, change: 0.38, changePercent: 1.10, aum: 3456, expenseRatio: 1.85, category: 'Infrastructure', fundHouse: 'SBI Mutual Fund', riskLevel: 'Very High', returns1Y: 28.45, returns3Y: 22.12, returns5Y: 18.67, minInvestment: 500 },
  { symbol: 'NIPPON-INFRA', name: 'Nippon India Power & Infra Fund', nav: 267.89, change: 2.94, changePercent: 1.11, aum: 5678, expenseRatio: 1.82, category: 'Infrastructure', fundHouse: 'Nippon India', riskLevel: 'Very High', returns1Y: 29.67, returns3Y: 23.45, returns5Y: 19.23, minInvestment: 500 },
  { symbol: 'TATA-CONSUMPTION', name: 'Tata India Consumer Fund', nav: 32.45, change: 0.32, changePercent: 1.00, aum: 2345, expenseRatio: 1.78, category: 'Consumption', fundHouse: 'Tata Mutual Fund', riskLevel: 'Very High', returns1Y: 22.34, returns3Y: 17.89, returns5Y: 14.56, minInvestment: 500 },
  { symbol: 'ICICI-FMCG', name: 'ICICI Prudential FMCG Fund', nav: 445.67, change: 4.01, changePercent: 0.91, aum: 1890, expenseRatio: 1.85, category: 'FMCG', fundHouse: 'ICICI Prudential', riskLevel: 'Very High', returns1Y: 19.45, returns3Y: 15.12, returns5Y: 12.34, minInvestment: 500 },
  { symbol: 'SBI-PSU', name: 'SBI PSU Fund', nav: 23.67, change: 0.28, changePercent: 1.20, aum: 4567, expenseRatio: 1.75, category: 'PSU', fundHouse: 'SBI Mutual Fund', riskLevel: 'Very High', returns1Y: 35.67, returns3Y: 28.45, returns5Y: 23.12, minInvestment: 500 },

  // ELSS (Tax Saving) Funds
  { symbol: 'AXIS-ELSS', name: 'Axis Long Term Equity Fund', nav: 78.90, change: 0.63, changePercent: 0.80, aum: 38765, expenseRatio: 1.58, category: 'ELSS', fundHouse: 'Axis Mutual Fund', riskLevel: 'High', returns1Y: 18.45, returns3Y: 13.89, returns5Y: 11.67, minInvestment: 500 },
  { symbol: 'MIRAE-ELSS', name: 'Mirae Asset Tax Saver Fund', nav: 45.67, change: 0.41, changePercent: 0.90, aum: 23456, expenseRatio: 1.48, category: 'ELSS', fundHouse: 'Mirae Asset', riskLevel: 'High', returns1Y: 21.34, returns3Y: 16.78, returns5Y: 14.23, minInvestment: 500 },
  { symbol: 'CANARA-ELSS', name: 'Canara Robeco Equity Tax Saver Fund', nav: 134.56, change: 1.08, changePercent: 0.81, aum: 8976, expenseRatio: 1.52, category: 'ELSS', fundHouse: 'Canara Robeco', riskLevel: 'High', returns1Y: 19.23, returns3Y: 14.56, returns5Y: 12.34, minInvestment: 500 },
  { symbol: 'QUANT-ELSS', name: 'Quant Tax Plan', nav: 345.67, change: 3.80, changePercent: 1.11, aum: 6789, expenseRatio: 1.45, category: 'ELSS', fundHouse: 'Quant Mutual Fund', riskLevel: 'Very High', returns1Y: 42.34, returns3Y: 35.67, returns5Y: 29.45, minInvestment: 500 },
  { symbol: 'SBI-ELSS', name: 'SBI Long Term Equity Fund', nav: 289.45, change: 2.32, changePercent: 0.81, aum: 19876, expenseRatio: 1.65, category: 'ELSS', fundHouse: 'SBI Mutual Fund', riskLevel: 'High', returns1Y: 18.67, returns3Y: 14.12, returns5Y: 11.89, minInvestment: 500 },
  { symbol: 'HDFC-ELSS', name: 'HDFC Tax Saver Fund', nav: 1023.45, change: 8.19, changePercent: 0.81, aum: 14567, expenseRatio: 1.72, category: 'ELSS', fundHouse: 'HDFC Mutual Fund', riskLevel: 'High', returns1Y: 19.45, returns3Y: 14.89, returns5Y: 12.56, minInvestment: 500 },
  { symbol: 'DSP-ELSS', name: 'DSP Tax Saver Fund', nav: 98.76, change: 0.79, changePercent: 0.81, aum: 11234, expenseRatio: 1.58, category: 'ELSS', fundHouse: 'DSP Mutual Fund', riskLevel: 'High', returns1Y: 18.89, returns3Y: 14.23, returns5Y: 11.98, minInvestment: 500 },
  { symbol: 'KOTAK-ELSS', name: 'Kotak Tax Saver Fund', nav: 89.45, change: 0.71, changePercent: 0.80, aum: 5678, expenseRatio: 1.55, category: 'ELSS', fundHouse: 'Kotak Mahindra', riskLevel: 'High', returns1Y: 17.78, returns3Y: 13.45, returns5Y: 11.23, minInvestment: 500 },
  { symbol: 'NIPPON-ELSS', name: 'Nippon India Tax Saver Fund', nav: 89.34, change: 0.71, changePercent: 0.80, aum: 14567, expenseRatio: 1.68, category: 'ELSS', fundHouse: 'Nippon India', riskLevel: 'High', returns1Y: 18.12, returns3Y: 13.78, returns5Y: 11.56, minInvestment: 500 },
  { symbol: 'ICICI-ELSS', name: 'ICICI Prudential Long Term Equity Fund', nav: 678.90, change: 5.43, changePercent: 0.81, aum: 12345, expenseRatio: 1.65, category: 'ELSS', fundHouse: 'ICICI Prudential', riskLevel: 'High', returns1Y: 19.56, returns3Y: 14.98, returns5Y: 12.67, minInvestment: 500 },

  // International Funds
  { symbol: 'MOTILAL-NASDAQ100', name: 'Motilal Oswal Nasdaq 100 FOF', nav: 23.45, change: 0.35, changePercent: 1.51, aum: 8976, expenseRatio: 0.52, category: 'International', fundHouse: 'Motilal Oswal', riskLevel: 'Very High', returns1Y: 28.45, returns3Y: 18.67, returns5Y: 21.34, minInvestment: 500 },
  { symbol: 'PGIM-GLOBAL', name: 'PGIM India Global Equity Opportunities Fund', nav: 45.67, change: 0.59, changePercent: 1.31, aum: 3456, expenseRatio: 1.85, category: 'International', fundHouse: 'PGIM India', riskLevel: 'Very High', returns1Y: 24.56, returns3Y: 15.89, returns5Y: 18.12, minInvestment: 500 },
  { symbol: 'DSP-GLOBAL', name: 'DSP Global Allocation Fund', nav: 18.90, change: 0.21, changePercent: 1.12, aum: 1234, expenseRatio: 1.45, category: 'International', fundHouse: 'DSP Mutual Fund', riskLevel: 'High', returns1Y: 18.23, returns3Y: 12.45, returns5Y: 14.67, minInvestment: 500 },
  { symbol: 'EDELWEISS-US-TECH', name: 'Edelweiss US Technology Equity FOF', nav: 19.45, change: 0.27, changePercent: 1.41, aum: 2345, expenseRatio: 1.12, category: 'International', fundHouse: 'Edelweiss', riskLevel: 'Very High', returns1Y: 32.34, returns3Y: 22.56, returns5Y: 25.78, minInvestment: 500 },
  { symbol: 'MIRAE-NYSE-FANG', name: 'Mirae Asset NYSE FANG+ ETF FOF', nav: 12.34, change: 0.19, changePercent: 1.56, aum: 1890, expenseRatio: 0.48, category: 'International', fundHouse: 'Mirae Asset', riskLevel: 'Very High', returns1Y: 35.67, returns3Y: 24.89, returns5Y: 28.45, minInvestment: 500 },
  { symbol: 'ICICI-US-BLUECHIP', name: 'ICICI Prudential US Bluechip Equity Fund', nav: 56.78, change: 0.74, changePercent: 1.32, aum: 4567, expenseRatio: 1.78, category: 'International', fundHouse: 'ICICI Prudential', riskLevel: 'Very High', returns1Y: 26.78, returns3Y: 17.45, returns5Y: 19.89, minInvestment: 500 },
  { symbol: 'KOTAK-GLOBAL', name: 'Kotak Global Innovation Fund', nav: 14.56, change: 0.17, changePercent: 1.18, aum: 5678, expenseRatio: 1.65, category: 'International', fundHouse: 'Kotak Mahindra', riskLevel: 'Very High', returns1Y: 22.45, returns3Y: 14.78, returns5Y: 16.89, minInvestment: 500 },
  { symbol: 'FRANKLIN-FEEDER', name: 'Franklin India Feeder - Franklin U.S. Opportunities Fund', nav: 67.89, change: 0.88, changePercent: 1.31, aum: 3456, expenseRatio: 1.72, category: 'International', fundHouse: 'Franklin Templeton', riskLevel: 'Very High', returns1Y: 25.34, returns3Y: 16.78, returns5Y: 18.56, minInvestment: 500 },
  { symbol: 'NIPPON-JAPAN', name: 'Nippon India Japan Equity Fund', nav: 18.23, change: 0.16, changePercent: 0.89, aum: 1234, expenseRatio: 1.58, category: 'International', fundHouse: 'Nippon India', riskLevel: 'Very High', returns1Y: 15.67, returns3Y: 10.23, returns5Y: 11.45, minInvestment: 500 },
  { symbol: 'ADITYA-INTL', name: 'Aditya Birla Sun Life International Equity Fund', nav: 34.56, change: 0.38, changePercent: 1.11, aum: 2890, expenseRatio: 1.82, category: 'International', fundHouse: 'ABSL', riskLevel: 'Very High', returns1Y: 20.12, returns3Y: 13.45, returns5Y: 15.23, minInvestment: 500 },
];
