import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify user
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, stock_symbol, stock_name, quantity, price_per_unit } = body;

    // Validate
    if (!["buy", "sell"].includes(action)) {
      return new Response(JSON.stringify({ error: "Action must be 'buy' or 'sell'" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (typeof stock_symbol !== "string" || stock_symbol.length === 0 || stock_symbol.length > 50) {
      return new Response(JSON.stringify({ error: "Invalid stock_symbol" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (typeof stock_name !== "string" || stock_name.length === 0 || stock_name.length > 200) {
      return new Response(JSON.stringify({ error: "Invalid stock_name" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (typeof quantity !== "number" || !Number.isFinite(quantity) || quantity <= 0 || quantity > 1000000) {
      return new Response(JSON.stringify({ error: "Quantity must be a positive number (max 1,000,000)" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (typeof price_per_unit !== "number" || !Number.isFinite(price_per_unit) || price_per_unit <= 0) {
      return new Response(JSON.stringify({ error: "Price must be a positive number" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const total_amount = parseFloat((quantity * price_per_unit).toFixed(2));
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    if (action === "buy") {
      const { data: profile, error: profileError } = await adminClient
        .from("profiles").select("balance").eq("id", user.id).single();

      if (profileError || !profile) {
        return new Response(JSON.stringify({ error: "Profile not found" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (profile.balance < total_amount) {
        return new Response(JSON.stringify({ error: "Insufficient balance", required: total_amount, available: profile.balance }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: txError } = await adminClient.from("transactions").insert({
        user_id: user.id, stock_symbol, stock_name, transaction_type: "buy", quantity, price_per_unit, total_amount,
      });
      if (txError) throw txError;

      const { data: existing } = await adminClient.from("user_investments")
        .select("*").eq("user_id", user.id).eq("stock_symbol", stock_symbol).maybeSingle();

      if (existing) {
        const newQty = existing.quantity + quantity;
        const avgPrice = parseFloat((((existing.purchase_price * existing.quantity) + total_amount) / newQty).toFixed(2));
        const { error } = await adminClient.from("user_investments")
          .update({ quantity: newQty, purchase_price: avgPrice }).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await adminClient.from("user_investments").insert({
          user_id: user.id, stock_symbol, stock_name, quantity, purchase_price: price_per_unit,
        });
        if (error) throw error;
      }

      const { error: balError } = await adminClient.from("profiles")
        .update({ balance: parseFloat((profile.balance - total_amount).toFixed(2)) }).eq("id", user.id);
      if (balError) throw balError;

      return new Response(JSON.stringify({ success: true, action: "buy", total_amount }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else {
      const { data: investment } = await adminClient.from("user_investments")
        .select("*").eq("user_id", user.id).eq("stock_symbol", stock_symbol).maybeSingle();

      if (!investment || investment.quantity < quantity) {
        return new Response(JSON.stringify({ error: "Insufficient shares", available: investment?.quantity || 0 }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: txError } = await adminClient.from("transactions").insert({
        user_id: user.id, stock_symbol, stock_name, transaction_type: "sell", quantity, price_per_unit, total_amount,
      });
      if (txError) throw txError;

      if (investment.quantity === quantity) {
        const { error } = await adminClient.from("user_investments").delete().eq("id", investment.id);
        if (error) throw error;
      } else {
        const { error } = await adminClient.from("user_investments")
          .update({ quantity: investment.quantity - quantity }).eq("id", investment.id);
        if (error) throw error;
      }

      const { data: profile } = await adminClient.from("profiles").select("balance").eq("id", user.id).single();
      if (profile) {
        const { error } = await adminClient.from("profiles")
          .update({ balance: parseFloat((profile.balance + total_amount).toFixed(2)) }).eq("id", user.id);
        if (error) throw error;
      }

      return new Response(JSON.stringify({ success: true, action: "sell", total_amount }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error("Trade execution error:", err);
    return new Response(JSON.stringify({ error: "Trade execution failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
