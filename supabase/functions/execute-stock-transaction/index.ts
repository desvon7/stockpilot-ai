
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

    const userId = user.id;
    const { symbol, companyName, transactionType, shares, pricePerShare, totalAmount } = await req.json();
    
    // First, create a transaction record
    const { data: transactionData, error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: userId,
        symbol,
        company_name: companyName,
        transaction_type: transactionType,
        shares,
        price_per_share: pricePerShare,
        total_amount: totalAmount,
        status: 'completed'
      })
      .select()
      .single();
    
    if (transactionError) {
      throw transactionError;
    }
    
    // Next, update the portfolio
    // Check if the user already has this stock in their portfolio
    const { data: portfolioData, error: portfolioError } = await supabaseClient
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .eq('symbol', symbol)
      .maybeSingle();
    
    if (portfolioError) {
      throw portfolioError;
    }
    
    if (transactionType === 'buy') {
      if (portfolioData) {
        // Update existing portfolio item
        const newShares = Number(portfolioData.shares) + Number(shares);
        const newAveragePrice = ((Number(portfolioData.shares) * Number(portfolioData.average_price)) + 
                                 (Number(shares) * Number(pricePerShare))) / newShares;
        
        const { error: updateError } = await supabaseClient
          .from('portfolios')
          .update({ 
            shares: newShares, 
            average_price: newAveragePrice,
            updated_at: new Date().toISOString()
          })
          .eq('id', portfolioData.id);
        
        if (updateError) {
          throw updateError;
        }
      } else {
        // Create new portfolio item
        const { error: insertError } = await supabaseClient
          .from('portfolios')
          .insert({
            user_id: userId,
            symbol,
            company_name: companyName,
            shares,
            average_price: pricePerShare
          });
        
        if (insertError) {
          throw insertError;
        }
      }
    } else if (transactionType === 'sell') {
      if (!portfolioData) {
        throw new Error('Cannot sell a stock that is not in your portfolio');
      }
      
      const newShares = Number(portfolioData.shares) - Number(shares);
      
      if (newShares < 0) {
        throw new Error('Cannot sell more shares than you own');
      } else if (newShares === 0) {
        // Remove from portfolio if all shares are sold
        const { error: deleteError } = await supabaseClient
          .from('portfolios')
          .delete()
          .eq('id', portfolioData.id);
        
        if (deleteError) {
          throw deleteError;
        }
      } else {
        // Update with remaining shares
        const { error: updateError } = await supabaseClient
          .from('portfolios')
          .update({ 
            shares: newShares,
            updated_at: new Date().toISOString()
          })
          .eq('id', portfolioData.id);
        
        if (updateError) {
          throw updateError;
        }
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully ${transactionType === 'buy' ? 'bought' : 'sold'} ${shares} shares of ${symbol}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error executing stock transaction:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to execute transaction' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
