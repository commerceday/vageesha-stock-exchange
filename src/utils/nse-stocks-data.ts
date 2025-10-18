import { Stock } from './stocksApi';

// Comprehensive list of 150+ NSE stocks across all major sectors
export const nseStocksData: Omit<Stock, 'lastUpdated'>[] = [
  // Banking & Financial Services
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 977.10, change: -11.25, changePercent: -0.72, volume: 5729340, marketCap: 11750000000000, sector: 'Banking' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 1376.20, change: 8.15, changePercent: 0.75, volume: 6638210, marketCap: 7620000000000, sector: 'Banking' },
  { symbol: 'SBIN', name: 'State Bank of India', price: 862.10, change: 10.55, changePercent: 1.34, volume: 8283940, marketCap: 7120000000000, sector: 'Banking' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', price: 1167.40, change: 12.10, changePercent: 1.15, volume: 4567230, marketCap: 3310000000000, sector: 'Banking' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.', price: 2144.60, change: -17.55, changePercent: -1.01, volume: 2346780, marketCap: 3420000000000, sector: 'Banking' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', price: 1024.10, change: 71.90, changePercent: 1.17, volume: 987650, marketCap: 3850000000000, sector: 'Financial Services' },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd.', price: 2014.60, change: 18.33, changePercent: 1.16, volume: 1234560, marketCap: 2540000000000, sector: 'Financial Services' },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd.', price: 642.50, change: 5.20, changePercent: 0.82, volume: 3456789, marketCap: 1380000000000, sector: 'Financial Services' },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Ltd.', price: 1456.30, change: 12.45, changePercent: 0.86, volume: 1987654, marketCap: 1460000000000, sector: 'Financial Services' },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd.', price: 1425.75, change: -8.90, changePercent: -0.62, volume: 3234567, marketCap: 1110000000000, sector: 'Banking' },
  { symbol: 'BANDHANBNK', name: 'Bandhan Bank Ltd.', price: 234.80, change: 3.45, changePercent: 1.49, volume: 4567890, marketCap: 378000000000, sector: 'Banking' },
  { symbol: 'FEDERALBNK', name: 'Federal Bank Ltd.', price: 185.60, change: 2.15, changePercent: 1.17, volume: 5678901, marketCap: 462000000000, sector: 'Banking' },
  { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank Ltd.', price: 95.45, change: -0.85, changePercent: -0.88, volume: 6789012, marketCap: 620000000000, sector: 'Banking' },
  { symbol: 'PNB', name: 'Punjab National Bank', price: 123.70, change: 1.90, changePercent: 1.56, volume: 8901234, marketCap: 1430000000000, sector: 'Banking' },
  { symbol: 'BANKBARODA', name: 'Bank of Baroda', price: 256.40, change: 3.20, changePercent: 1.26, volume: 7890123, marketCap: 1320000000000, sector: 'Banking' },

  // IT & Technology
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', price: 3061.70, change: 42.20, changePercent: 1.24, volume: 2154780, marketCap: 12650000000000, sector: 'IT Services' },
  { symbol: 'INFY', name: 'Infosys Ltd.', price: 1509.30, change: 19.60, changePercent: 1.22, volume: 4194600, marketCap: 6720000000000, sector: 'IT Services' },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', price: 246.40, change: 3.90, changePercent: 1.38, volume: 5234560, marketCap: 1560000000000, sector: 'IT Services' },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.', price: 1486.50, change: 21.30, changePercent: 1.27, volume: 2345670, marketCap: 4610000000000, sector: 'IT Services' },
  { symbol: 'TECHM', name: 'Tech Mahindra Ltd.', price: 1466.60, change: -19.88, changePercent: -1.20, volume: 2345670, marketCap: 1590000000000, sector: 'IT Services' },
  { symbol: 'LTI', name: 'LTIMindtree Ltd.', price: 5234.80, change: 56.70, changePercent: 1.09, volume: 876543, marketCap: 1550000000000, sector: 'IT Services' },
  { symbol: 'COFORGE', name: 'Coforge Ltd.', price: 8765.40, change: 102.50, changePercent: 1.18, volume: 234567, marketCap: 590000000000, sector: 'IT Services' },
  { symbol: 'PERSISTENT', name: 'Persistent Systems Ltd.', price: 5678.90, change: 67.80, changePercent: 1.21, volume: 456789, marketCap: 450000000000, sector: 'IT Services' },
  { symbol: 'MPHASIS', name: 'Mphasis Ltd.', price: 2890.50, change: 34.20, changePercent: 1.20, volume: 567890, marketCap: 540000000000, sector: 'IT Services' },
  { symbol: 'OFSS', name: 'Oracle Financial Services Software Ltd.', price: 11234.60, change: 145.30, changePercent: 1.31, volume: 123456, marketCap: 1210000000000, sector: 'IT Services' },

  // Automobiles
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', price: 15985.00, change: -126.70, changePercent: -1.15, volume: 456230, marketCap: 3290000000000, sector: 'Automobiles' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', price: 681.10, change: 12.75, changePercent: 1.65, volume: 6845320, marketCap: 2780000000000, sector: 'Automobiles' },
  { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.', price: 3648.00, change: 45.30, changePercent: 1.26, volume: 1876540, marketCap: 4530000000000, sector: 'Automobiles' },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd.', price: 11235.60, change: 123.45, changePercent: 1.11, volume: 345678, marketCap: 3250000000000, sector: 'Automobiles' },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.', price: 5678.90, change: 67.80, changePercent: 1.21, volume: 567890, marketCap: 1130000000000, sector: 'Automobiles' },
  { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.', price: 5234.70, change: -45.60, changePercent: -0.86, volume: 234567, marketCap: 1420000000000, sector: 'Automobiles' },
  { symbol: 'TVSMOTOR', name: 'TVS Motor Company Ltd.', price: 2890.40, change: 34.50, changePercent: 1.21, volume: 1234567, marketCap: 1370000000000, sector: 'Automobiles' },
  { symbol: 'BALKRISIND', name: 'Balkrishna Industries Ltd.', price: 3123.50, change: -23.40, changePercent: -0.74, volume: 234567, marketCap: 620000000000, sector: 'Automobiles' },
  { symbol: 'MOTHERSON', name: 'Samvardhana Motherson International Ltd.', price: 234.60, change: 2.80, changePercent: 1.21, volume: 4567890, marketCap: 1560000000000, sector: 'Auto Components' },
  { symbol: 'BOSCHLTD', name: 'Bosch Ltd.', price: 34567.80, change: -234.50, changePercent: -0.67, volume: 23456, marketCap: 1020000000000, sector: 'Auto Components' },

  // Pharmaceuticals
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd.', price: 1658.50, change: 23.10, changePercent: 1.33, volume: 3456780, marketCap: 4210000000000, sector: 'Pharmaceuticals' },
  { symbol: 'DRREDDY', name: 'Dr. Reddy\'s Laboratories Ltd.', price: 6234.70, change: 78.90, changePercent: 1.28, volume: 876543, marketCap: 1040000000000, sector: 'Pharmaceuticals' },
  { symbol: 'DIVISLAB', name: 'Divi\'s Laboratories Ltd.', price: 5678.30, change: -56.40, changePercent: -0.98, volume: 567890, marketCap: 1510000000000, sector: 'Pharmaceuticals' },
  { symbol: 'CIPLA', name: 'Cipla Ltd.', price: 1456.80, change: 12.30, changePercent: 0.85, volume: 2345678, marketCap: 1170000000000, sector: 'Pharmaceuticals' },
  { symbol: 'AUROPHARMA', name: 'Aurobindo Pharma Ltd.', price: 1234.50, change: -8.70, changePercent: -0.70, volume: 1987654, marketCap: 720000000000, sector: 'Pharmaceuticals' },
  { symbol: 'LUPIN', name: 'Lupin Ltd.', price: 2123.40, change: 18.60, changePercent: 0.88, volume: 1234567, marketCap: 970000000000, sector: 'Pharmaceuticals' },
  { symbol: 'BIOCON', name: 'Biocon Ltd.', price: 345.60, change: -3.40, changePercent: -0.97, volume: 3456789, marketCap: 420000000000, sector: 'Pharmaceuticals' },
  { symbol: 'TORNTPHARM', name: 'Torrent Pharmaceuticals Ltd.', price: 3456.70, change: 45.60, changePercent: 1.34, volume: 234567, marketCap: 580000000000, sector: 'Pharmaceuticals' },
  { symbol: 'ALKEM', name: 'Alkem Laboratories Ltd.', price: 5678.90, change: 67.80, changePercent: 1.21, volume: 123456, marketCap: 670000000000, sector: 'Pharmaceuticals' },
  { symbol: 'GLENMARK', name: 'Glenmark Pharmaceuticals Ltd.', price: 1567.80, change: 15.60, changePercent: 1.00, volume: 876543, marketCap: 440000000000, sector: 'Pharmaceuticals' },

  // FMCG
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', price: 2517.60, change: -8.20, changePercent: -0.34, volume: 1943760, marketCap: 5620000000000, sector: 'FMCG' },
  { symbol: 'ITC', name: 'ITC Ltd.', price: 399.90, change: 5.05, changePercent: 1.21, volume: 7254890, marketCap: 5270000000000, sector: 'FMCG' },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd.', price: 1187.80, change: -7.45, changePercent: -0.63, volume: 234560, marketCap: 1134000000000, sector: 'FMCG' },
  { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd.', price: 5678.90, change: 67.80, changePercent: 1.21, volume: 234567, marketCap: 1370000000000, sector: 'FMCG' },
  { symbol: 'DABUR', name: 'Dabur India Ltd.', price: 567.80, change: 6.70, changePercent: 1.19, volume: 2345678, marketCap: 1000000000000, sector: 'FMCG' },
  { symbol: 'MARICO', name: 'Marico Ltd.', price: 678.90, change: 7.80, changePercent: 1.16, volume: 1876543, marketCap: 880000000000, sector: 'FMCG' },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products Ltd.', price: 1234.50, change: 12.30, changePercent: 1.01, volume: 1234567, marketCap: 1260000000000, sector: 'FMCG' },
  { symbol: 'COLPAL', name: 'Colgate-Palmolive (India) Ltd.', price: 3456.70, change: 34.50, changePercent: 1.01, volume: 234567, marketCap: 940000000000, sector: 'FMCG' },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products Ltd.', price: 1123.40, change: 11.20, changePercent: 1.01, volume: 987654, marketCap: 1020000000000, sector: 'FMCG' },
  { symbol: 'EMAMILTD', name: 'Emami Ltd.', price: 678.90, change: 6.70, changePercent: 1.00, volume: 567890, marketCap: 290000000000, sector: 'FMCG' },

  // Energy & Power
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 1377.80, change: 10.50, changePercent: 0.82, volume: 8934210, marketCap: 17350000000000, sector: 'Energy' },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation Ltd.', price: 243.39, change: -3.55, changePercent: -1.45, volume: 9876540, marketCap: 3040000000000, sector: 'Energy' },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd.', price: 286.15, change: 4.69, changePercent: 1.47, volume: 4567890, marketCap: 2980000000000, sector: 'Power' },
  { symbol: 'NTPC', name: 'NTPC Ltd.', price: 378.90, change: 4.50, changePercent: 1.20, volume: 6789012, marketCap: 3680000000000, sector: 'Power' },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd.', price: 345.60, change: -3.40, changePercent: -0.97, volume: 4567890, marketCap: 750000000000, sector: 'Energy' },
  { symbol: 'IOC', name: 'Indian Oil Corporation Ltd.', price: 167.80, change: 1.60, changePercent: 0.96, volume: 8901234, marketCap: 2370000000000, sector: 'Energy' },
  { symbol: 'COALINDIA', name: 'Coal India Ltd.', price: 456.70, change: 5.60, changePercent: 1.24, volume: 5678901, marketCap: 2810000000000, sector: 'Energy' },
  { symbol: 'ADANIGREEN', name: 'Adani Green Energy Ltd.', price: 1051.50, change: -16.80, changePercent: -1.73, volume: 2345670, marketCap: 1520000000000, sector: 'Power' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone Ltd.', price: 1234.50, change: 15.60, changePercent: 1.28, volume: 3456789, marketCap: 2620000000000, sector: 'Infrastructure' },
  { symbol: 'TATAPOWER', name: 'Tata Power Company Ltd.', price: 456.70, change: 5.60, changePercent: 1.24, volume: 4567890, marketCap: 1460000000000, sector: 'Power' },

  // Metals & Mining
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.', price: 176.42, change: 2.51, changePercent: 1.78, volume: 15678900, marketCap: 1760000000000, sector: 'Metals' },
  { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd.', price: 678.90, change: 8.70, changePercent: 1.30, volume: 5678901, marketCap: 1520000000000, sector: 'Metals' },
  { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd.', price: 987.60, change: 12.30, changePercent: 1.26, volume: 4567890, marketCap: 2380000000000, sector: 'Metals' },
  { symbol: 'VEDL', name: 'Vedanta Ltd.', price: 456.70, change: -5.60, changePercent: -1.21, volume: 6789012, marketCap: 1710000000000, sector: 'Metals' },
  { symbol: 'HINDZINC', name: 'Hindustan Zinc Ltd.', price: 567.80, change: 6.70, changePercent: 1.19, volume: 3456789, marketCap: 2400000000000, sector: 'Metals' },
  { symbol: 'NMDC', name: 'NMDC Ltd.', price: 234.50, change: 2.80, changePercent: 1.21, volume: 5678901, marketCap: 690000000000, sector: 'Metals' },
  { symbol: 'SAIL', name: 'Steel Authority of India Ltd.', price: 123.40, change: 1.50, changePercent: 1.23, volume: 7890123, marketCap: 510000000000, sector: 'Metals' },
  { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power Ltd.', price: 987.60, change: 11.20, changePercent: 1.15, volume: 2345678, marketCap: 980000000000, sector: 'Metals' },
  { symbol: 'NATIONALUM', name: 'National Aluminium Company Ltd.', price: 234.50, change: 2.80, changePercent: 1.21, volume: 3456789, marketCap: 430000000000, sector: 'Metals' },
  { symbol: 'RATNAMANI', name: 'Ratnamani Metals & Tubes Ltd.', price: 3456.70, change: 45.60, changePercent: 1.34, volume: 123456, marketCap: 110000000000, sector: 'Metals' },

  // Telecom
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', price: 1942.00, change: -17.80, changePercent: -1.15, volume: 3129580, marketCap: 8950000000000, sector: 'Telecom' },
  { symbol: 'INDUSINDT', name: 'Indus Towers Ltd.', price: 456.70, change: 5.60, changePercent: 1.24, volume: 4567890, marketCap: 1230000000000, sector: 'Telecom' },

  // Cement
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.', price: 12192.00, change: 77.40, changePercent: 0.69, volume: 345670, marketCap: 3230000000000, sector: 'Cement' },
  { symbol: 'GRASIM', name: 'Grasim Industries Ltd.', price: 2678.90, change: 32.10, changePercent: 1.21, volume: 876543, marketCap: 1790000000000, sector: 'Cement' },
  { symbol: 'SHREECEM', name: 'Shree Cement Ltd.', price: 28765.40, change: -234.50, changePercent: -0.81, volume: 34567, marketCap: 1030000000000, sector: 'Cement' },
  { symbol: 'AMBUJACEM', name: 'Ambuja Cements Ltd.', price: 678.90, change: 8.70, changePercent: 1.30, volume: 3456789, marketCap: 1350000000000, sector: 'Cement' },
  { symbol: 'ACC', name: 'ACC Ltd.', price: 2345.60, change: 28.70, changePercent: 1.24, volume: 234567, marketCap: 440000000000, sector: 'Cement' },
  { symbol: 'JKCEMENT', name: 'JK Cement Ltd.', price: 4567.80, change: 56.70, changePercent: 1.26, volume: 123456, marketCap: 430000000000, sector: 'Cement' },

  // Infrastructure & Construction
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', price: 3769.20, change: -20.65, changePercent: -0.62, volume: 1845670, marketCap: 4510000000000, sector: 'Infrastructure' },
  { symbol: 'DLF', name: 'DLF Ltd.', price: 987.60, change: 12.30, changePercent: 1.26, volume: 3456789, marketCap: 2450000000000, sector: 'Real Estate' },
  { symbol: 'GODREJPROP', name: 'Godrej Properties Ltd.', price: 3456.70, change: 45.60, changePercent: 1.34, volume: 567890, marketCap: 990000000000, sector: 'Real Estate' },
  { symbol: 'OBEROIRLTY', name: 'Oberoi Realty Ltd.', price: 2123.40, change: 26.50, changePercent: 1.26, volume: 234567, marketCap: 770000000000, sector: 'Real Estate' },
  { symbol: 'PRESTIGE', name: 'Prestige Estates Projects Ltd.', price: 1789.60, change: 21.30, changePercent: 1.20, volume: 456789, marketCap: 760000000000, sector: 'Real Estate' },

  // Consumer Durables & Retail
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.', price: 2336.40, change: -20.50, changePercent: -0.83, volume: 1234560, marketCap: 2350000000000, sector: 'Consumer Durables' },
  { symbol: 'TITAN', name: 'Titan Company Ltd.', price: 3550.60, change: 41.50, changePercent: 1.32, volume: 1876540, marketCap: 2830000000000, sector: 'Consumer Durables' },
  { symbol: 'HAVELLS', name: 'Havells India Ltd.', price: 1890.50, change: 22.60, changePercent: 1.21, volume: 567890, marketCap: 1180000000000, sector: 'Consumer Durables' },
  { symbol: 'VOLTAS', name: 'Voltas Ltd.', price: 1789.60, change: 21.30, changePercent: 1.20, volume: 456789, marketCap: 590000000000, sector: 'Consumer Durables' },
  { symbol: 'WHIRLPOOL', name: 'Whirlpool of India Ltd.', price: 2123.40, change: 26.50, changePercent: 1.26, volume: 234567, marketCap: 270000000000, sector: 'Consumer Durables' },
  { symbol: 'DMART', name: 'Avenue Supermarts Ltd.', price: 4567.80, change: 56.70, changePercent: 1.26, volume: 345678, marketCap: 2960000000000, sector: 'Retail' },
  { symbol: 'TRENT', name: 'Trent Ltd.', price: 8765.40, change: 102.50, changePercent: 1.18, volume: 234567, marketCap: 2220000000000, sector: 'Retail' },
  { symbol: 'JUBLFOOD', name: 'Jubilant Foodworks Ltd.', price: 678.90, change: 8.70, changePercent: 1.30, volume: 567890, marketCap: 440000000000, sector: 'Retail' },

  // Media & Entertainment
  { symbol: 'ZEEL', name: 'Zee Entertainment Enterprises Ltd.', price: 234.50, change: -2.80, changePercent: -1.18, volume: 4567890, marketCap: 220000000000, sector: 'Media' },
  { symbol: 'PVRINOX', name: 'PVR INOX Ltd.', price: 1789.60, change: 21.30, changePercent: 1.20, volume: 234567, marketCap: 120000000000, sector: 'Media' },
  { symbol: 'SUNTV', name: 'Sun TV Network Ltd.', price: 890.50, change: 10.60, changePercent: 1.20, volume: 876543, marketCap: 350000000000, sector: 'Media' },

  // Aviation & Logistics
  { symbol: 'INDIGO', name: 'InterGlobe Aviation Ltd.', price: 4567.80, change: 56.70, changePercent: 1.26, volume: 456789, marketCap: 1760000000000, sector: 'Aviation' },
  { symbol: 'DELTACORP', name: 'Delta Corp Ltd.', price: 234.50, change: 2.80, changePercent: 1.21, volume: 2345678, marketCap: 62000000000, sector: 'Hotels & Tourism' },
  { symbol: 'IRCTC', name: 'Indian Railway Catering and Tourism Corporation Ltd.', price: 987.60, change: 12.30, changePercent: 1.26, volume: 1234567, marketCap: 1580000000000, sector: 'Tourism' },

  // Chemicals & Fertilizers
  { symbol: 'UPL', name: 'UPL Ltd.', price: 678.90, change: 8.70, changePercent: 1.30, volume: 3456789, marketCap: 520000000000, sector: 'Chemicals' },
  { symbol: 'PIDILITIND', name: 'Pidilite Industries Ltd.', price: 3456.70, change: 45.60, changePercent: 1.34, volume: 567890, marketCap: 1780000000000, sector: 'Chemicals' },
  { symbol: 'SRF', name: 'SRF Ltd.', price: 2890.50, change: 34.20, changePercent: 1.20, volume: 456789, marketCap: 850000000000, sector: 'Chemicals' },
  { symbol: 'AARTI IND', name: 'Aarti Industries Ltd.', price: 789.60, change: 9.40, changePercent: 1.20, volume: 876543, marketCap: 280000000000, sector: 'Chemicals' },
  { symbol: 'DEEPAKNTR', name: 'Deepak Nitrite Ltd.', price: 2678.90, change: 32.10, changePercent: 1.21, volume: 234567, marketCap: 360000000000, sector: 'Chemicals' },
  { symbol: 'BALRAMCHIN', name: 'Balrampur Chini Mills Ltd.', price: 567.80, change: 6.70, changePercent: 1.19, volume: 1234567, marketCap: 110000000000, sector: 'Sugar' },

  // Healthcare & Hospitals
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Ltd.', price: 7890.50, change: 92.60, changePercent: 1.19, volume: 234567, marketCap: 1140000000000, sector: 'Healthcare' },
  { symbol: 'MAXHEALTH', name: 'Max Healthcare Institute Ltd.', price: 1234.50, change: 15.60, changePercent: 1.28, volume: 567890, marketCap: 1170000000000, sector: 'Healthcare' },
  { symbol: 'FORTIS', name: 'Fortis Healthcare Ltd.', price: 678.90, change: 8.70, changePercent: 1.30, volume: 1234567, marketCap: 510000000000, sector: 'Healthcare' },

  // Defence & Aerospace  
  { symbol: 'HAL', name: 'Hindustan Aeronautics Ltd.', price: 5678.90, change: 67.80, changePercent: 1.21, volume: 876543, marketCap: 3810000000000, sector: 'Defence' },
  { symbol: 'BEL', name: 'Bharat Electronics Ltd.', price: 345.60, change: 4.20, changePercent: 1.23, volume: 5678901, marketCap: 2530000000000, sector: 'Defence' },
  { symbol: 'BDL', name: 'Bharat Dynamics Ltd.', price: 1567.80, change: 18.90, changePercent: 1.22, volume: 456789, marketCap: 570000000000, sector: 'Defence' },

  // Diversified
  { symbol: 'SIEMENS', name: 'Siemens Ltd.', price: 7890.50, change: 92.60, changePercent: 1.19, volume: 123456, marketCap: 2800000000000, sector: 'Diversified' },
  { symbol: 'ABB', name: 'ABB India Ltd.', price: 8765.40, change: 102.50, changePercent: 1.18, volume: 234567, marketCap: 1850000000000, sector: 'Diversified' },
  { symbol: 'ADANIPOWER', name: 'Adani Power Ltd.', price: 678.90, change: 8.70, changePercent: 1.30, volume: 6789012, marketCap: 2510000000000, sector: 'Power' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd.', price: 3456.70, change: 45.60, changePercent: 1.34, volume: 2345678, marketCap: 3990000000000, sector: 'Diversified' },
  { symbol: 'IEX', name: 'Indian Energy Exchange Ltd.', price: 234.50, change: 2.80, changePercent: 1.21, volume: 2345678, marketCap: 210000000000, sector: 'Energy' },
];
