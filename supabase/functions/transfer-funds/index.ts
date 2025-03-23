
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

    const { accountId, amount } = await req.json();
    
    if (!accountId || !amount) {
      return new Response(
        JSON.stringify({ error: 'Account ID and amount are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate amount is positive
    if (parseFloat(amount) <= 0) {
      return new Response(
        JSON.stringify({ error: 'Amount must be a positive number' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Find bank account
    const { data: bankAccount, error: bankAccountError } = await supabaseClient
      .from('bank_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (bankAccountError || !bankAccount) {
      return new Response(
        JSON.stringify({ error: 'Bank account not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Check if account belongs to user
    if (bankAccount.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Not authorized to access this bank account' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Check if sufficient balance in bank account (mock balance check)
    if (bankAccount.balance < parseFloat(amount)) {
      return new Response(
        JSON.stringify({ error: 'Insufficient funds in bank account' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Update bank account balance
    const { error: updateBankError } = await supabaseClient
      .from('bank_accounts')
      .update({ 
        balance: bankAccount.balance - parseFloat(amount),
        updated_at: new Date().toISOString()
      })
      .eq('id', accountId);

    if (updateBankError) {
      throw new Error(`Error updating bank account: ${updateBankError.message}`);
    }

    // Get the user profile to update buying power
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('User profile not found');
    }

    // Update user's buying power
    const currentBuyingPower = profile.buying_power || 0;
    const { error: updateProfileError } = await supabaseClient
      .from('profiles')
      .update({ 
        buying_power: currentBuyingPower + parseFloat(amount),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateProfileError) {
      throw new Error(`Error updating user profile: ${updateProfileError.message}`);
    }

    // Get updated bank account and profile
    const { data: updatedBankAccount } = await supabaseClient
      .from('bank_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    const { data: updatedProfile } = await supabaseClient
      .from('profiles')
      .select('id, email, first_name, last_name, buying_power')
      .eq('id', user.id)
      .single();

    return new Response(
      JSON.stringify({
        bankAccount: updatedBankAccount,
        user: updatedProfile
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Transfer error:', error.message);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
