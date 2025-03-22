
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!STRIPE_SECRET_KEY) {
    return new Response(
      JSON.stringify({ error: 'Stripe API key not configured' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });

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

    const { paymentIntentId, amount } = await req.json();
    
    if (!paymentIntentId || !amount) {
      return new Response(
        JSON.stringify({ error: 'Payment intent ID and amount are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return new Response(
        JSON.stringify({ error: 'Payment not successful' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Verify user ID in metadata
    if (paymentIntent.metadata.userId !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Not authorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
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

    // Add funds to user's buying power
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

    // Record the transaction
    const { error: transactionError } = await supabaseClient
      .from('fund_transactions')
      .insert({
        user_id: user.id,
        amount: parseFloat(amount),
        type: 'deposit',
        payment_method: 'stripe',
        payment_id: paymentIntentId,
        status: 'completed'
      });

    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
      // Continue since the funds were already added
    }

    // Get updated profile
    const { data: updatedProfile } = await supabaseClient
      .from('profiles')
      .select('id, email, first_name, last_name, buying_power')
      .eq('id', user.id)
      .single();

    return new Response(
      JSON.stringify({
        success: true,
        user: updatedProfile
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Payment success error:', error.message);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
