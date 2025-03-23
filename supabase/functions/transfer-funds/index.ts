import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user ID from the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Parse request body
    const requestData = await req.json();
    const { action, amount } = requestData;

    console.log("Request received:", action, amount, requestData);

    // Handle different actions
    if (action === 'create_link_token') {
      // Mock response - in production, this would call the Plaid API
      return new Response(
        JSON.stringify({ 
          link_token: 'mock-link-token-' + Date.now(),
          success: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    else if (action === 'exchange_public_token') {
      const { public_token, metadata } = requestData;
      
      if (!public_token) {
        throw new Error('Public token is required');
      }

      if (!amount || isNaN(parseFloat(amount))) {
        throw new Error('Valid amount is required');
      }

      // In production this would exchange the token with Plaid
      // For now, just mock a successful response and update the user's buying power

      // Get the user profile to update buying power
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('buying_power')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw new Error(`Error fetching user profile: ${profileError.message}`);
      }

      const currentBuyingPower = profile?.buying_power || 0;
      const newBuyingPower = currentBuyingPower + parseFloat(amount);

      // Update user's buying power
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ 
          buying_power: newBuyingPower,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        throw new Error(`Error updating buying power: ${updateError.message}`);
      }

      // Log a transaction for bookkeeping
      const { error: transactionError } = await supabaseClient
        .from('transactions')
        .insert({
          user_id: user.id,
          symbol: 'CASH',
          company_name: 'Cash Deposit',
          transaction_type: 'deposit',
          shares: 1,
          price_per_share: parseFloat(amount),
          total_amount: parseFloat(amount),
          status: 'completed'
        });

      if (transactionError) {
        console.error('Error logging transaction:', transactionError);
        // Continue anyway as this is not critical
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          amount: parseFloat(amount),
          new_balance: newBuyingPower
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    else {
      throw new Error(`Unsupported action: ${action}`);
    }
  } catch (error) {
    console.error('Transfer funds error:', error.message);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Server error', success: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
