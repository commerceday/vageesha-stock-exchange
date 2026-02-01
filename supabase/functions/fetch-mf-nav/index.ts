import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NAVData {
  schemeCode: string;
  schemeName: string;
  nav: number;
  date: string;
}

// Fallback NAV data for when the API is unavailable
const fallbackNAVData: Record<string, NAVData> = {
  '119598': { schemeCode: '119598', schemeName: 'SBI Blue Chip Fund - Direct Plan - Growth', nav: 78.45, date: 'Fallback' },
  '100025': { schemeCode: '100025', schemeName: 'HDFC Top 100 Fund - Growth Option', nav: 945.67, date: 'Fallback' },
  '120505': { schemeCode: '120505', schemeName: 'ICICI Prudential Bluechip Fund - Direct Plan - Growth', nav: 89.34, date: 'Fallback' },
  '120503': { schemeCode: '120503', schemeName: 'Axis Bluechip Fund - Direct Plan - Growth', nav: 56.78, date: 'Fallback' },
  '118834': { schemeCode: '118834', schemeName: 'Mirae Asset Large Cap Fund - Direct Plan - Growth', nav: 98.56, date: 'Fallback' },
  '112323': { schemeCode: '112323', schemeName: 'Kotak Bluechip Fund - Direct Plan - Growth', nav: 523.45, date: 'Fallback' },
  '122639': { schemeCode: '122639', schemeName: 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth', nav: 67.89, date: 'Fallback' },
  '100474': { schemeCode: '100474', schemeName: 'HDFC Mid-Cap Opportunities Fund - Growth Option', nav: 145.67, date: 'Fallback' },
  '125497': { schemeCode: '125497', schemeName: 'SBI Small Cap Fund - Direct Plan - Growth', nav: 156.78, date: 'Fallback' },
  '118778': { schemeCode: '118778', schemeName: 'Nippon India Small Cap Fund - Direct Plan - Growth', nav: 145.67, date: 'Fallback' },
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
        `https://api.mfapi.in/mf/${schemeCode}/latest`,
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
    const { schemeCodes } = await req.json();
    
    if (!schemeCodes || !Array.isArray(schemeCodes)) {
      console.error('Invalid request: schemeCodes array required');
      return new Response(
        JSON.stringify({ error: 'schemeCodes array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
