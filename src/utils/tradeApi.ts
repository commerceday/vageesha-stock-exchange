import { supabase } from '@/integrations/supabase/client';

interface TradeParams {
  action: 'buy' | 'sell';
  stock_symbol: string;
  stock_name: string;
  quantity: number;
  price_per_unit: number;
}

interface TradeResult {
  success: boolean;
  error?: string;
  total_amount?: number;
  available?: number;
  required?: number;
}

export async function executeTrade(params: TradeParams): Promise<TradeResult> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data, error } = await supabase.functions.invoke('execute-trade', {
    body: params,
  });

  if (error) {
    // Try to parse error body
    try {
      const errBody = typeof error.message === 'string' ? JSON.parse(error.message) : error;
      return { success: false, error: errBody.error || 'Trade execution failed' };
    } catch {
      return { success: false, error: error.message || 'Trade execution failed' };
    }
  }

  return data as TradeResult;
}
