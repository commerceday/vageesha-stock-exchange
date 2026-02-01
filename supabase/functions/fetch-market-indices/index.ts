import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MAX_SYMBOLS = 20;
const SYMBOL_REGEX = /^[A-Z0-9_-]{1,20}$/;

interface IndexSymbol {
  symbol: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    const { symbols } = await req.json() as { symbols: IndexSymbol[] };

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
    
    console.log('Fetching market indices for:', symbols);
    
    const marketOpen = checkMarketHours();
    
    // Fetch all indices concurrently
    const results = await Promise.all(
      symbols.map(async ({ symbol }) => {
        try {
          // Map Indian indices to Yahoo Finance symbols
          const yahooSymbol = mapToYahooSymbol(symbol);
          
          const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`;
          console.log(`Fetching from Yahoo Finance: ${url}`);
          
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0'
            }
          });
          
          if (!response.ok) {
            console.error(`Yahoo Finance API error for ${symbol}: ${response.status}`);
            return { symbol, error: 'API error', marketClosed: !marketOpen };
          }
          
          const data = await response.json();
          
          if (!data.chart?.result?.[0]) {
            console.error(`No data returned for ${symbol}`);
            return { symbol, error: 'No data', marketClosed: !marketOpen };
          }
          
          const result = data.chart.result[0];
          const quote = result.meta;
          
          const currentPrice = quote.regularMarketPrice || quote.previousClose;
          const previousClose = quote.previousClose || quote.chartPreviousClose;
          const change = currentPrice - previousClose;
          const changePercent = (change / previousClose) * 100;
          
          console.log(`${symbol}: Price=${currentPrice}, Change=${change}, Change%=${changePercent}`);
          
          return {
            symbol,
            value: currentPrice,
            change: change,
            changePercent: changePercent,
            marketClosed: !marketOpen,
            lastUpdated: new Date().toISOString()
          };
          
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          return { symbol, error: errorMessage, marketClosed: !marketOpen };
        }
      })
    );
    
    return new Response(
      JSON.stringify({ 
        data: results,
        marketOpen: marketOpen,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Error in fetch-market-indices:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function mapToYahooSymbol(symbol: string): string {
  // Map index symbols to Yahoo Finance symbols
  const symbolMap: Record<string, string> = {
    'NIFTY50': '^NSEI',
    'SENSEX': '^BSESN',
    'NIFTYBANK': '^NSEBANK',
    'NIFTYIT': '^CNXIT',
    'NIFTYNEXT50': 'NIFTYJR.NS',
    'NIFTYMIDCAP': '^NSEMDCP50',
    'SPX': '^GSPC',
    'DJI': '^DJI',
    'IXIC': '^IXIC',
    'RUT': '^RUT',
    'FTSE': '^FTSE',
    'FTMC': '^FTMC',
    'N225': '^N225',
    'TOPX': '^TOPX'
  };
  
  return symbolMap[symbol] || symbol;
}

function checkMarketHours(): boolean {
  // Get current time in IST
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istTime = new Date(now.getTime() + istOffset);
  
  const day = istTime.getUTCDay();
  const hours = istTime.getUTCHours();
  const minutes = istTime.getUTCMinutes();
  
  // Check if it's a weekday (Monday = 1, Friday = 5)
  if (day === 0 || day === 6) {
    return false;
  }
  
  // Market hours: 9:15 AM to 3:30 PM IST
  const currentTimeInMinutes = hours * 60 + minutes;
  const marketOpen = 9 * 60 + 15;  // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM
  
  return currentTimeInMinutes >= marketOpen && currentTimeInMinutes <= marketClose;
}
