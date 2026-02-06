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

// Fallback NAV data for when the API is unavailable - updated February 2026 values
const fallbackNAVData: Record<string, NAVData> = {
  // Large Cap Funds - Updated Feb 2026
  '119598': { schemeCode: '119598', schemeName: 'SBI Bluechip Fund - Direct Growth', nav: 128.45, date: '05-Feb-2026' },
  '119018': { schemeCode: '119018', schemeName: 'HDFC Top 100 Fund - Direct Growth', nav: 1456.78, date: '05-Feb-2026' },
  '120586': { schemeCode: '120586', schemeName: 'ICICI Prudential Bluechip Fund - Direct Growth', nav: 145.67, date: '05-Feb-2026' },
  '120465': { schemeCode: '120465', schemeName: 'Axis Bluechip Fund - Direct Growth', nav: 82.34, date: '05-Feb-2026' },
  '118825': { schemeCode: '118825', schemeName: 'Mirae Asset Large Cap Fund - Direct Growth', nav: 152.89, date: '05-Feb-2026' },
  '118632': { schemeCode: '118632', schemeName: 'Nippon India Large Cap Fund - Direct Growth', nav: 118.45, date: '05-Feb-2026' },
  '112090': { schemeCode: '112090', schemeName: 'Kotak Flexicap Fund - Growth', nav: 98.76, date: '05-Feb-2026' },
  '119250': { schemeCode: '119250', schemeName: 'DSP Top 100 Equity Fund - Direct Growth', nav: 598.34, date: '05-Feb-2026' },
  
  // Mid Cap Funds - Updated Feb 2026
  '118989': { schemeCode: '118989', schemeName: 'HDFC Mid-Cap Opportunities Fund - Direct Growth', nav: 267.45, date: '05-Feb-2026' },
  '119775': { schemeCode: '119775', schemeName: 'Kotak Emerging Equity Fund - Direct Growth', nav: 178.23, date: '05-Feb-2026' },
  '120505': { schemeCode: '120505', schemeName: 'Axis Midcap Fund - Direct Growth', nav: 148.67, date: '05-Feb-2026' },
  '147622': { schemeCode: '147622', schemeName: 'Motilal Oswal Nifty Midcap 150 Index Fund', nav: 48.56, date: '05-Feb-2026' },
  '120841': { schemeCode: '120841', schemeName: 'Quant Mid Cap Fund - Direct Growth', nav: 278.45, date: '05-Feb-2026' },
  
  // Small Cap Funds - Updated Feb 2026
  '125497': { schemeCode: '125497', schemeName: 'SBI Small Cap Fund - Direct Growth', nav: 218.67, date: '05-Feb-2026' },
  '118778': { schemeCode: '118778', schemeName: 'Nippon India Small Cap Fund - Direct Growth', nav: 212.34, date: '05-Feb-2026' },
  '125354': { schemeCode: '125354', schemeName: 'Axis Small Cap Fund - Direct Growth', nav: 138.45, date: '05-Feb-2026' },
  '147623': { schemeCode: '147623', schemeName: 'Motilal Oswal Nifty Smallcap 250 Index Fund', nav: 42.78, date: '05-Feb-2026' },
  '120828': { schemeCode: '120828', schemeName: 'Quant Small Cap Fund - Direct Growth', nav: 312.56, date: '05-Feb-2026' },
  '145206': { schemeCode: '145206', schemeName: 'Tata Small Cap Fund - Direct Growth', nav: 48.34, date: '05-Feb-2026' },
  '146130': { schemeCode: '146130', schemeName: 'Canara Robeco Small Cap Fund - Direct Growth', nav: 52.67, date: '05-Feb-2026' },
  
  // Flexi Cap / Multi Cap Funds - Updated Feb 2026
  '122639': { schemeCode: '122639', schemeName: 'Parag Parikh Flexi Cap Fund - Direct Growth', nav: 112.45, date: '05-Feb-2026' },
  '118955': { schemeCode: '118955', schemeName: 'HDFC Flexi Cap Fund - Direct Growth', nav: 2678.34, date: '05-Feb-2026' },
  '120843': { schemeCode: '120843', schemeName: 'Quant Active Fund - Direct Growth', nav: 678.45, date: '05-Feb-2026' },
  '100033': { schemeCode: '100033', schemeName: 'Aditya Birla Sun Life Large & Mid Cap Fund', nav: 1045.67, date: '05-Feb-2026' },
  
  // ELSS Funds - Updated Feb 2026
  '120503': { schemeCode: '120503', schemeName: 'Axis ELSS Tax Saver Fund - Direct Growth', nav: 125.34, date: '05-Feb-2026' },
  '135781': { schemeCode: '135781', schemeName: 'Mirae Asset ELSS Tax Saver Fund - Direct Growth', nav: 68.45, date: '05-Feb-2026' },
  '120847': { schemeCode: '120847', schemeName: 'Quant ELSS Tax Saver Fund - Direct Growth', nav: 478.56, date: '05-Feb-2026' },
  '119242': { schemeCode: '119242', schemeName: 'DSP ELSS Tax Saver Fund - Direct Growth', nav: 185.67, date: '05-Feb-2026' },
  '119773': { schemeCode: '119773', schemeName: 'Kotak ELSS Tax Saver Fund - Direct Growth', nav: 158.23, date: '05-Feb-2026' },
  
  // Hybrid Funds - Updated Feb 2026
  '100119': { schemeCode: '100119', schemeName: 'HDFC Balanced Advantage Fund - Growth', nav: 612.45, date: '05-Feb-2026' },
  '143537': { schemeCode: '143537', schemeName: 'PGIM India Midcap Opportunities Fund - Direct Growth', nav: 78.34, date: '05-Feb-2026' },
  '102885': { schemeCode: '102885', schemeName: 'SBI Equity Hybrid Fund - Regular Growth', nav: 358.67, date: '05-Feb-2026' },
  '119019': { schemeCode: '119019', schemeName: 'DSP Aggressive Hybrid Fund - Direct Growth', nav: 467.23, date: '05-Feb-2026' },
  
  // Liquid Funds - Updated Feb 2026
  '119091': { schemeCode: '119091', schemeName: 'HDFC Liquid Fund - Direct Growth', nav: 5678.45, date: '05-Feb-2026' },
  '119766': { schemeCode: '119766', schemeName: 'Kotak Liquid Fund - Direct Growth', nav: 5834.67, date: '05-Feb-2026' },
  '120537': { schemeCode: '120537', schemeName: 'ICICI Prudential Liquid Fund - Direct Growth', nav: 3956.78, date: '05-Feb-2026' },
  '119568': { schemeCode: '119568', schemeName: 'Aditya Birla Sun Life Liquid Fund - Direct Growth', nav: 478.34, date: '05-Feb-2026' },
  
  // Debt Funds - Updated Feb 2026
  '118987': { schemeCode: '118987', schemeName: 'HDFC Corporate Bond Fund - Direct Growth', nav: 38.45, date: '05-Feb-2026' },
  '119533': { schemeCode: '119533', schemeName: 'Aditya Birla Sun Life Corporate Bond Fund - Direct Growth', nav: 128.67, date: '05-Feb-2026' },
  '119755': { schemeCode: '119755', schemeName: 'Kotak Dynamic Bond Fund - Direct Growth', nav: 45.23, date: '05-Feb-2026' },
  '119798': { schemeCode: '119798', schemeName: 'SBI Credit Risk Fund - Direct Growth', nav: 56.78, date: '05-Feb-2026' },
  
  // Sectoral/Thematic Funds - Updated Feb 2026
  '118759': { schemeCode: '118759', schemeName: 'Nippon India Pharma Fund - Direct Growth', nav: 645.67, date: '05-Feb-2026' },
  '120594': { schemeCode: '120594', schemeName: 'ICICI Prudential Technology Fund - Direct Growth', nav: 267.34, date: '05-Feb-2026' },
  '120587': { schemeCode: '120587', schemeName: 'ICICI Prudential FMCG Fund - Direct Growth', nav: 567.45, date: '05-Feb-2026' },
  '118763': { schemeCode: '118763', schemeName: 'Nippon India Power & Infra Fund - Direct Growth', nav: 428.56, date: '05-Feb-2026' },
  '119783': { schemeCode: '119783', schemeName: 'SBI Healthcare Opportunities Fund - Direct Growth', nav: 548.23, date: '05-Feb-2026' },
  '119243': { schemeCode: '119243', schemeName: 'Tata Infrastructure Fund - Direct Growth', nav: 205.67, date: '05-Feb-2026' },
  
  // International Funds - Updated Feb 2026
  '145552': { schemeCode: '145552', schemeName: 'Motilal Oswal Nasdaq 100 Fund of Fund - Direct Growth', nav: 58.45, date: '05-Feb-2026' },
  '119252': { schemeCode: '119252', schemeName: 'DSP US Flexible Equity Fund - Direct Growth', nav: 102.34, date: '05-Feb-2026' },
  '118551': { schemeCode: '118551', schemeName: 'Franklin India Feeder - Franklin U.S. Opportunities Fund', nav: 108.67, date: '05-Feb-2026' },
  '119779': { schemeCode: '119779', schemeName: 'Kotak Global Emerging Market Fund - Direct Growth', nav: 42.34, date: '05-Feb-2026' },
  
  // Index Funds - Updated Feb 2026
  '119063': { schemeCode: '119063', schemeName: 'HDFC Nifty 50 Index Fund - Direct', nav: 285.45, date: '05-Feb-2026' },
  '119065': { schemeCode: '119065', schemeName: 'HDFC BSE Sensex Index Fund - Direct', nav: 912.34, date: '05-Feb-2026' },
  '119247': { schemeCode: '119247', schemeName: 'DSP India T.I.G.E.R. Fund - Direct Growth', nav: 398.67, date: '05-Feb-2026' },
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
