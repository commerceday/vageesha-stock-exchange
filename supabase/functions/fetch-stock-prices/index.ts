import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_SYMBOLS = 50;
const SYMBOL_REGEX = /^[A-Z0-9&_-]{1,20}$/;

interface StockSymbol {
  symbol: string;
}

// Some NSE symbols in our dataset are legacy tickers; Yahoo Finance uses updated tickers.
// We keep all overrides here so every page (Stocks/ETFs/Portfolio) stays consistent.
const yahooTickerOverrides: Record<string, string> = {
  // Stocks
  LTI: "LTIM",
  MINDTREE: "LTIM",
  ZENSAR: "ZENSARTECH",
  AMARAJABAT: "ARE&M",
  BIRLASOF: "BSOFT",
  IDBIBANK: "IDBI",

  // ETFs
  ICICIN50: "ICICINIF50",
  CPSE: "CPSEETF",
};

function toYahooTicker(symbol: string): string {
  return yahooTickerOverrides[symbol] ?? symbol;
}

function toYahooNseSymbol(symbol: string): string {
  return `${toYahooTicker(symbol)}.NS`;
}

type YahooQuote = {
  symbol: string;
  regularMarketPrice?: number;
  regularMarketPreviousClose?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketOpen?: number;
};

async function fetchYahooQuotes(yahooSymbols: string[]): Promise<YahooQuote[]> {
  // Try the chart endpoint for each symbol as v7/quote is now blocked
  const quotes: YahooQuote[] = [];
  
  // Fetch in parallel batches of 10 to avoid overwhelming
  const batchSize = 10;
  for (let i = 0; i < yahooSymbols.length; i += batchSize) {
    const batch = yahooSymbols.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(async (symbol) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json",
          },
        });
        
        if (!res.ok) {
          console.error(`Chart request failed for ${symbol}: ${res.status}`);
          return null;
        }
        
        const json = await res.json();
        const result = json?.chart?.result?.[0];
        if (!result) return null;
        
        const meta = result.meta;
        const quote = result.indicators?.quote?.[0];
        
        // Get the most recent values
        const regularPrice = meta?.regularMarketPrice ?? 0;
        const prevClose = meta?.chartPreviousClose ?? meta?.previousClose ?? 0;
        const high = quote?.high?.[quote.high.length - 1] ?? meta?.regularMarketDayHigh ?? 0;
        const low = quote?.low?.[quote.low.length - 1] ?? meta?.regularMarketDayLow ?? 0;
        const open = quote?.open?.[0] ?? meta?.regularMarketOpen ?? 0;
        
        return {
          symbol,
          regularMarketPrice: regularPrice,
          regularMarketPreviousClose: prevClose,
          regularMarketChange: regularPrice - prevClose,
          regularMarketChangePercent: prevClose > 0 ? ((regularPrice - prevClose) / prevClose) * 100 : 0,
          regularMarketDayHigh: high,
          regularMarketDayLow: low,
          regularMarketOpen: open,
        } as YahooQuote;
      })
    );
    
    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        quotes.push(result.value);
      }
    }
  }
  
  return quotes;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    // Preflight request for browsers
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { symbols } = (await req.json()) as { symbols: StockSymbol[] };

    // Input validation
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid request: symbols array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (symbols.length > MAX_SYMBOLS) {
      return new Response(JSON.stringify({ error: `Maximum ${MAX_SYMBOLS} symbols allowed per request` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    for (const item of symbols) {
      if (!item.symbol || typeof item.symbol !== "string" || !SYMBOL_REGEX.test(item.symbol)) {
        return new Response(JSON.stringify({ error: `Invalid symbol format: ${item.symbol}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Check if Indian stock market is open (IST: 9:15 AM - 3:30 PM, Mon-Fri)
    const isMarketOpen = checkMarketHours();

    // Use a single batched quote request (fast + reliable) instead of 1 request per symbol.
    const requested = symbols.map(({ symbol }) => ({
      symbol,
      yahooSymbol: toYahooNseSymbol(symbol),
    }));

    const yahooQuotes = await fetchYahooQuotes(requested.map((r) => r.yahooSymbol));
    const quoteByYahooSymbol = new Map<string, YahooQuote>(yahooQuotes.map((q) => [q.symbol, q]));

    const stockData = requested.map(({ symbol, yahooSymbol }) => {
      const q = quoteByYahooSymbol.get(yahooSymbol);
      if (!q) return { symbol, error: true };

      const regularPrice = typeof q.regularMarketPrice === "number" && isFinite(q.regularMarketPrice) ? q.regularMarketPrice : 0;
      const prevClose =
        typeof q.regularMarketPreviousClose === "number" && isFinite(q.regularMarketPreviousClose)
          ? q.regularMarketPreviousClose
          : 0;

      const price = regularPrice > 0 ? regularPrice : prevClose;

      const rawChange =
        typeof q.regularMarketChange === "number" && isFinite(q.regularMarketChange)
          ? q.regularMarketChange
          : price && prevClose
            ? price - prevClose
            : 0;

      const rawChangePercent =
        typeof q.regularMarketChangePercent === "number" && isFinite(q.regularMarketChangePercent)
          ? q.regularMarketChangePercent
          : prevClose > 0
            ? (rawChange / prevClose) * 100
            : 0;

      return {
        symbol,
        price,
        previousClose: prevClose || price,
        change: isMarketOpen ? rawChange : 0,
        changePercent: isMarketOpen ? rawChangePercent : 0,
        high: typeof q.regularMarketDayHigh === "number" ? q.regularMarketDayHigh : 0,
        low: typeof q.regularMarketDayLow === "number" ? q.regularMarketDayLow : 0,
        open: typeof q.regularMarketOpen === "number" ? q.regularMarketOpen : 0,
        marketClosed: !isMarketOpen,
      };
    });

    return new Response(
      JSON.stringify({
        data: stockData,
        marketOpen: isMarketOpen,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in fetch-stock-prices:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
