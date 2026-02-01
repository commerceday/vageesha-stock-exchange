import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MAX_SCHEMES = 50;
const SCHEME_CODE_REGEX = /^\d{1,10}$/;

interface NAVData {
  schemeCode: string;
  schemeName: string;
  nav: number;
  date: string;
}

// Fallback NAV data for when the API is unavailable - using realistic current values
const fallbackNAVData: Record<string, NAVData> = {
  // Mutual Funds - Direct Growth Plans
  '119598': { schemeCode: '119598', schemeName: 'SBI Blue Chip Fund - Direct Plan - Growth', nav: 104.84, date: 'Fallback' },
  '118989': { schemeCode: '118989', schemeName: 'HDFC Top 100 Fund - Direct Plan - Growth', nav: 1135.45, date: 'Fallback' },
  '120505': { schemeCode: '120505', schemeName: 'ICICI Prudential Bluechip Fund - Direct Plan - Growth', nav: 128.71, date: 'Fallback' },
  '120503': { schemeCode: '120503', schemeName: 'Axis Bluechip Fund - Direct Plan - Growth', nav: 67.89, date: 'Fallback' },
  '118834': { schemeCode: '118834', schemeName: 'Mirae Asset Large Cap Fund - Direct Plan - Growth', nav: 119.45, date: 'Fallback' },
  '120281': { schemeCode: '120281', schemeName: 'Kotak Bluechip Fund - Direct Plan - Growth', nav: 589.23, date: 'Fallback' },
  '122639': { schemeCode: '122639', schemeName: 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth', nav: 89.56, date: 'Fallback' },
  '101799': { schemeCode: '101799', schemeName: 'HDFC Mid-Cap Opportunities Fund - Direct Plan - Growth', nav: 189.34, date: 'Fallback' },
  '125354': { schemeCode: '125354', schemeName: 'SBI Small Cap Fund - Direct Plan - Growth', nav: 198.67, date: 'Fallback' },
  '118778': { schemeCode: '118778', schemeName: 'Nippon India Small Cap Fund - Direct Plan - Growth', nav: 189.45, date: 'Fallback' },
  // ETFs
  '120716': { schemeCode: '120716', schemeName: 'Nippon India ETF Nifty BeES', nav: 267.12, date: 'Fallback' },
  '136794': { schemeCode: '136794', schemeName: 'SBI ETF Nifty 50', nav: 234.34, date: 'Fallback' },
  '120323': { schemeCode: '120323', schemeName: 'ICICI Prudential Nifty 50 ETF', nav: 535.18, date: 'Fallback' },
  '118836': { schemeCode: '118836', schemeName: 'Nippon India ETF Nifty Bank BeES', nav: 456.34, date: 'Fallback' },
  '120713': { schemeCode: '120713', schemeName: 'Nippon India ETF Junior BeES', nav: 567.45, date: 'Fallback' },
  '107574': { schemeCode: '107574', schemeName: 'Nippon India ETF Gold BeES', nav: 11.05, date: 'Fallback' },
  '120712': { schemeCode: '120712', schemeName: 'Nippon India ETF Nifty IT BeES', nav: 378.45, date: 'Fallback' },
  '140555': { schemeCode: '140555', schemeName: 'Nippon India ETF Nifty PSU Bank BeES', nav: 10.00, date: 'Fallback' },
  '120711': { schemeCode: '120711', schemeName: 'Nippon India ETF Infra BeES', nav: 36.86, date: 'Fallback' },
  '147830': { schemeCode: '147830', schemeName: 'Nippon India Silver ETF', nav: 17.65, date: 'Fallback' },
  '140524': { schemeCode: '140524', schemeName: 'Motilal Oswal NASDAQ 100 ETF', nav: 12.48, date: 'Fallback' },
  '136714': { schemeCode: '136714', schemeName: 'CPSE ETF', nav: 78.67, date: 'Fallback' },
  '136797': { schemeCode: '136797', schemeName: 'SBI ETF Nifty Bank', nav: 478.45, date: 'Fallback' },
  '120715': { schemeCode: '120715', schemeName: 'Nippon India ETF Sensex BeES', nav: 228.80, date: 'Fallback' },
};

async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchNAVFromMFAPI(schemeCodes: string[]): Promise<Record<string, NAVData>> {
  // Try the mfapi.in API which is more reliable
  const navMap: Record<string, NAVData> = {};
  
  // Fetch each scheme individually (mfapi.in returns one at a time)
  const fetchPromises = schemeCodes.map(async (schemeCode) => {
    try {
      const response = await fetchWithTimeout(
        `https://api.mfapi.in/mf/${encodeURIComponent(schemeCode)}/latest`,
        {
          headers: {
            'Accept': 'application/json',
          },
        },
        5000 // 5 second timeout per request
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
          const latestNav = data.data[0];
          navMap[schemeCode] = {
            schemeCode,
            schemeName: data.meta?.scheme_name || '',
            nav: parseFloat(latestNav.nav) || 0,
            date: latestNav.date || '',
          };
          console.log(`Fetched NAV for ${schemeCode}: ${latestNav.nav}`);
        }
      } else {
        console.log(`Failed to fetch ${schemeCode}: ${response.status}`);
      }
    } catch (err) {
      console.log(`Error fetching ${schemeCode}: ${err}`);
    }
  });
  
  await Promise.allSettled(fetchPromises);
  return navMap;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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

    const { schemeCodes } = await req.json();
    
    // Input validation: array required
    if (!schemeCodes || !Array.isArray(schemeCodes) || schemeCodes.length === 0) {
      console.error('Invalid request: schemeCodes array required');
      return new Response(
        JSON.stringify({ error: 'schemeCodes array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate array length
    if (schemeCodes.length > MAX_SCHEMES) {
      return new Response(
        JSON.stringify({ error: `Maximum ${MAX_SCHEMES} scheme codes allowed per request` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate each scheme code format (should be numeric)
    for (const schemeCode of schemeCodes) {
      if (typeof schemeCode !== 'string' || !SCHEME_CODE_REGEX.test(schemeCode)) {
        return new Response(
          JSON.stringify({ error: `Invalid scheme code format: ${schemeCode}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log(`Fetching NAV for ${schemeCodes.length} schemes`);

    // Try to fetch from mfapi.in (more reliable than AMFI direct)
    let navMap = await fetchNAVFromMFAPI(schemeCodes);
    
    // If we got no results, use fallback data
    const fetchedCount = Object.keys(navMap).length;
    console.log(`Fetched ${fetchedCount} schemes from API`);
    
    if (fetchedCount === 0) {
      console.log('Using fallback NAV data');
      // Filter fallback data to only include requested scheme codes
      for (const schemeCode of schemeCodes) {
        if (fallbackNAVData[schemeCode]) {
          navMap[schemeCode] = fallbackNAVData[schemeCode];
        }
      }
    } else {
      // Fill in any missing schemes with fallback data
      for (const schemeCode of schemeCodes) {
        if (!navMap[schemeCode] && fallbackNAVData[schemeCode]) {
          navMap[schemeCode] = fallbackNAVData[schemeCode];
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: navMap,
        source: fetchedCount > 0 ? 'live' : 'fallback',
        timestamp: new Date().toISOString(),
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching NAV data:', errorMessage);
    
    // Even on error, return fallback data so the UI doesn't break
    const fallbackResponse: Record<string, NAVData> = {};
    try {
      const body = await req.clone().json();
      if (body.schemeCodes && Array.isArray(body.schemeCodes)) {
        for (const schemeCode of body.schemeCodes) {
          if (fallbackNAVData[schemeCode]) {
            fallbackResponse[schemeCode] = fallbackNAVData[schemeCode];
          }
        }
      }
    } catch {
      // Ignore parse errors
    }
    
    if (Object.keys(fallbackResponse).length > 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: fallbackResponse,
          source: 'fallback',
          timestamp: new Date().toISOString(),
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch NAV data', 
        message: errorMessage 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
