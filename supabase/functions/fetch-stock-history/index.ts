// Fetch real historical OHLC data for a stock symbol using Yahoo Finance chart API
// Public edge function with CORS enabled

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HistoryRequest {
  symbol: string; // e.g. "HDFCBANK" or "HDFCBANK.NS"
  range?: string; // e.g. "1d", "5d", "1mo", "3mo", "6mo", "1y", "5y", "max"
  interval?: string; // e.g. "1m", "5m", "15m", "60m", "1d"
}

interface Candle {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as HistoryRequest;
    if (!body || !body.symbol) {
      return new Response(JSON.stringify({ error: "Missing 'symbol' in request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const symbol = body.symbol.endsWith(".NS") ? body.symbol : `${body.symbol}.NS`;
    const range = body.range ?? "1mo";
    const interval = body.interval ?? "1d";

    const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
    url.searchParams.set("range", range);
    url.searchParams.set("interval", interval);
    url.searchParams.set("includePrePost", "false");

    // Yahoo sometimes blocks default user agents; set a browser-like UA
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" },
    });

    if (!res.ok) {
      const text = await res.text();
      console.log(`Yahoo response not ok (${res.status}):`, text);
      return new Response(JSON.stringify({ error: "Failed to fetch from upstream" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result) {
      console.log("Yahoo response missing chart.result[0]", json);
      return new Response(JSON.stringify({ candles: [] }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const timestamps: number[] = result.timestamp ?? [];
    const quote = result.indicators?.quote?.[0];
    const opens: (number | null)[] = quote?.open ?? [];
    const highs: (number | null)[] = quote?.high ?? [];
    const lows: (number | null)[] = quote?.low ?? [];
    const closes: (number | null)[] = quote?.close ?? [];

    const len = Math.min(timestamps.length, opens.length, highs.length, lows.length, closes.length);
    const candles: Candle[] = [];

    for (let i = 0; i < len; i++) {
      const o = opens[i];
      const h = highs[i];
      const l = lows[i];
      const c = closes[i];
      const t = timestamps[i];
      if (o == null || h == null || l == null || c == null || t == null) continue;
      if (Number.isNaN(o) || Number.isNaN(h) || Number.isNaN(l) || Number.isNaN(c)) continue;
      candles.push({
        time: Number(t),
        open: Number(parseFloat(String(o)).toFixed(2)),
        high: Number(parseFloat(String(h)).toFixed(2)),
        low: Number(parseFloat(String(l)).toFixed(2)),
        close: Number(parseFloat(String(c)).toFixed(2)),
      });
    }

    // Ensure sorted by time ascending
    candles.sort((a, b) => a.time - b.time);

    return new Response(JSON.stringify({ candles }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-stock-history error:", e);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});