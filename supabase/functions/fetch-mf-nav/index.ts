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

    // AMFI provides a text file with all NAVs
    // Format: Scheme Code;ISIN Div Payout/ISIN Growth;ISIN Div Reinvestment;Scheme Name;Net Asset Value;Date
    const amfiUrl = 'https://www.amfiindia.com/spages/NAVAll.txt';
    
    const response = await fetch(amfiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`AMFI API error: ${response.status}`);
      throw new Error(`Failed to fetch NAV data: ${response.status}`);
    }

    const text = await response.text();
    const lines = text.split('\n');
    
    const navMap: Record<string, NAVData> = {};
    
    for (const line of lines) {
      const parts = line.split(';');
      if (parts.length >= 6) {
        const schemeCode = parts[0].trim();
        const schemeName = parts[3]?.trim() || '';
        const navValue = parseFloat(parts[4]?.trim() || '0');
        const date = parts[5]?.trim() || '';
        
        if (schemeCode && !isNaN(navValue) && schemeCodes.includes(schemeCode)) {
          navMap[schemeCode] = {
            schemeCode,
            schemeName,
            nav: navValue,
            date,
          };
        }
      }
    }

    console.log(`Found NAV data for ${Object.keys(navMap).length} schemes`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: navMap,
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
