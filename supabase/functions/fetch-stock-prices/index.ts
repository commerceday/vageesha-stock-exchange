import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StockSymbol {
  symbol: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols } = await req.json() as { symbols: StockSymbol[] };

    // Check if Indian stock market is open (IST: 9:15 AM - 3:30 PM, Mon-Fri)
    const isMarketOpen = checkMarketHours();
    console.log('Market status:', isMarketOpen ? 'OPEN' : 'CLOSED');

    const stockData = await Promise.all(
      symbols.map(async ({ symbol }) => {
        try {
          if (isMarketOpen) {
            // Fetch real-time data from Yahoo Finance API (free, supports NSE)
            const yahooSymbol = `${symbol}.NS`; // NSE stocks use .NS suffix
            const response = await fetch(
              `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`,
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
            
            const currentPrice = quote.meta.regularMarketPrice || 0;
            const previousClose = quote.meta.chartPreviousClose || quote.meta.previousClose || 0;
            const change = currentPrice - previousClose;
            const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;
            
            console.log(`${symbol}: Price=${currentPrice}, Change=${change}, %=${changePercent}`);
            
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
            const yahooSymbol = `${symbol}.NS`;
            const response = await fetch(
              `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`,
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

            // When market is closed, use the last trading day's close price
            const previousClose = quote.meta.previousClose || quote.meta.chartPreviousClose || 0;
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
