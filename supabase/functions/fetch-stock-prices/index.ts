import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StockSymbol {
  symbol: string;
  exchange: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols } = await req.json() as { symbols: StockSymbol[] };
    const apiKey = Deno.env.get('STOCK_API_KEY');
    
    if (!apiKey) {
      throw new Error('STOCK_API_KEY not configured');
    }

    // Check if Indian stock market is open (IST: 9:15 AM - 3:30 PM, Mon-Fri)
    const isMarketOpen = checkMarketHours();
    console.log('Market status:', isMarketOpen ? 'OPEN' : 'CLOSED');

    const stockData = await Promise.all(
      symbols.map(async ({ symbol, exchange }) => {
        try {
          if (isMarketOpen) {
            // Fetch real-time data from Finnhub API
            const response = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${exchange}:${symbol}&token=${apiKey}`
            );
            
            if (!response.ok) {
              console.error(`Failed to fetch ${symbol}: ${response.statusText}`);
              return { symbol, error: true };
            }
            
            const data = await response.json();
            
            return {
              symbol,
              price: data.c || 0, // current price
              change: data.d || 0, // change
              changePercent: data.dp || 0, // change percent
              high: data.h || 0,
              low: data.l || 0,
              open: data.o || 0,
              previousClose: data.pc || 0,
            };
          } else {
            // Market closed - return null to indicate pattern-based generation should be used
            return { symbol, marketClosed: true };
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
