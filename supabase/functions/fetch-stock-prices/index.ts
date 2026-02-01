import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MAX_SYMBOLS = 50;
const SYMBOL_REGEX = /^[A-Z0-9&_-]{1,20}$/;

interface StockSymbol {
  symbol: string;
}

// Some NSE symbols in our dataset are legacy tickers; Yahoo Finance uses updated tickers.
const yahooTickerOverrides: Record<string, string> = {
  LTI: 'LTIM',
  MINDTREE: 'LTIM',
  ZENSAR: 'ZENSARTECH',
  AMARAJABAT: 'ARE&M',
  BIRLASOF: 'BSOFT',
  IDBIBANK: 'IDBI',
};

function toYahooTicker(symbol: string): string {
  return yahooTickerOverrides[symbol] ?? symbol;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { symbols } = await req.json() as { symbols: StockSymbol[] };

    // Input validation
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: symbols array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (symbols.length > MAX_SYMBOLS) {
      return new Response(
        JSON.stringify({ error: `Maximum ${MAX_SYMBOLS} symbols allowed per request` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate each symbol format
    for (const item of symbols) {
      if (!item.symbol || typeof item.symbol !== 'string' || !SYMBOL_REGEX.test(item.symbol)) {
        return new Response(
          JSON.stringify({ error: `Invalid symbol format: ${item.symbol}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Check if Indian stock market is open (IST: 9:15 AM - 3:30 PM, Mon-Fri)
    const isMarketOpen = checkMarketHours();
    console.log('Market status:', isMarketOpen ? 'OPEN' : 'CLOSED');

    const stockData = await Promise.all(
      symbols.map(async ({ symbol }) => {
        try {
          if (isMarketOpen) {
            // Fetch real-time data from Yahoo Finance API (free, supports NSE)
            const yahooSymbol = `${toYahooTicker(symbol)}.NS`; // NSE stocks use .NS suffix
            const yahooSymbolEncoded = encodeURIComponent(yahooSymbol);
            const response = await fetch(
              `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbolEncoded}?interval=1d&range=1d`,
              {
                headers: {
                  'User-Agent': 'Mozilla/5.0'
                }
              }
            );
            
            if (!response.ok) {
              console.error(`Failed to fetch ${symbol}: ${response.statusText}`);
              return { symbol, error: true };
            }
            
            const data = await response.json();
            console.log(`Raw data for ${symbol}:`, JSON.stringify(data).substring(0, 200));
            
            const quote = data?.chart?.result?.[0];
            
            if (!quote || !quote.meta) {
              console.error(`No data for ${symbol}`);
              return { symbol, error: true };
            }
            
            // Get previous close from time series if available
            const closes: number[] | undefined = quote?.indicators?.quote?.[0]?.close;
            let seriesPrevClose = 0;
            if (Array.isArray(closes) && closes.length >= 2) {
              // Get second-to-last valid close as previous day's close
              for (let i = closes.length - 2; i >= 0; i--) {
                const val = closes[i];
                if (typeof val === 'number' && isFinite(val)) {
                  seriesPrevClose = val;
                  break;
                }
              }
            }
            
            const currentPrice = quote.meta.regularMarketPrice || 0;
            const metaPrevClose = quote.meta.chartPreviousClose || quote.meta.previousClose || 0;
            const previousClose = seriesPrevClose || metaPrevClose;
            const change = currentPrice && previousClose ? currentPrice - previousClose : 0;
            const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;
            
            console.log(`${symbol}: Price=${currentPrice}, PrevClose=${previousClose}, Change=${change}, %=${changePercent}`);
            
            return {
              symbol,
              price: currentPrice,
              change: change,
              changePercent: changePercent,
              high: quote.meta.regularMarketDayHigh || 0,
              low: quote.meta.regularMarketDayLow || 0,
              open: quote.meta.regularMarketOpen || 0,
              previousClose: previousClose,
            };
          } else {
            // Market closed - still fetch latest available data to anchor mock prices
            const yahooSymbol = `${toYahooTicker(symbol)}.NS`;
            const yahooSymbolEncoded = encodeURIComponent(yahooSymbol);
            const response = await fetch(
              `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbolEncoded}?interval=1d&range=1d`,
              {
                headers: {
                  'User-Agent': 'Mozilla/5.0'
                }
              }
            );

            if (!response.ok) {
              console.error(`Failed to fetch ${symbol} (closed): ${response.statusText}`);
              return { symbol, marketClosed: true, error: true };
            }

            const data = await response.json();
            const quote = data?.chart?.result?.[0];

            if (!quote || !quote.meta) {
              console.error(`No data for ${symbol} (closed)`);
              return { symbol, marketClosed: true, error: true };
            }

            // When market is closed, use the last trading day's close price (from series if available)
            const closes: number[] | undefined = quote?.indicators?.quote?.[0]?.close;
            let seriesLastClose = 0;
            if (Array.isArray(closes)) {
              for (let i = closes.length - 1; i >= 0; i--) {
                const val = closes[i];
                if (typeof val === 'number' && isFinite(val)) {
                  seriesLastClose = val;
                  break;
                }
              }
            }

            const metaPrevClose = quote.meta.previousClose || quote.meta.chartPreviousClose || 0;
            const previousClose = seriesLastClose || metaPrevClose;
            const change = 0; // No change when market is closed
            const changePercent = 0;

            console.log(`${symbol} (CLOSED): Last close=${previousClose}`);

            return {
              symbol,
              price: previousClose,
              change,
              changePercent,
              high: quote.meta.regularMarketDayHigh || 0,
              low: quote.meta.regularMarketDayLow || 0,
              open: quote.meta.regularMarketOpen || 0,
              previousClose,
              marketClosed: true
            };
          }
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          return { symbol, error: true };
        }
      })
    );

    return new Response(
      JSON.stringify({ 
        data: stockData,
        marketOpen: isMarketOpen,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-stock-prices:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function checkMarketHours(): boolean {
  const now = new Date();
  
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60; // minutes
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istTime = new Date(utcTime + (istOffset * 60000));
  
  const day = istTime.getDay(); // 0 = Sunday, 6 = Saturday
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  
  // Check if it's a weekday (Monday-Friday)
  if (day === 0 || day === 6) {
    return false;
  }
  
  // Market hours: 9:15 AM to 3:30 PM IST
  const currentMinutes = hours * 60 + minutes;
  const marketOpen = 9 * 60 + 15; // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM
  
  return currentMinutes >= marketOpen && currentMinutes <= marketClose;
}
