
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Validate the request method
    if (req.method !== 'POST') {
      throw new Error('Method not allowed. Please use POST');
    }

    // Get the JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token and get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized: Invalid token');
    }

    // Parse the request body
    const requestData = await req.json();
    const {
      symbol,
      companyName,
      transaction_type,
      shares,
      price_per_share,
      execution_type = 'market',
      limit_price = null
    } = requestData;

    console.log('Transaction request:', requestData);

    // Validate required fields
    if (!symbol || !companyName || !transaction_type || !shares || !price_per_share) {
      throw new Error('Missing required fields');
    }

    // Validate transaction type
    if (transaction_type !== 'buy' && transaction_type !== 'sell') {
      throw new Error('Invalid transaction type. Must be "buy" or "sell"');
    }

    // Validate limit order data
    if (execution_type === 'limit' && !limit_price) {
      throw new Error('Limit price required for limit orders');
    }

    // Additional validation for positive values
    if (shares <= 0) {
      throw new Error('Shares must be greater than zero');
    }

    if (price_per_share <= 0) {
      throw new Error('Price per share must be greater than zero');
    }

    // Calculate total amount
    const total_amount = shares * price_per_share;

    // Get user profile to check available funds
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('buying_power')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw new Error(`Error fetching user profile: ${profileError.message}`);
    }

    // For buy orders, check if user has enough buying power
    if (transaction_type === 'buy') {
      const buyingPower = userProfile?.buying_power || 0;
      if (buyingPower < total_amount) {
        throw new Error(`Insufficient funds. Required: $${total_amount.toFixed(2)}, Available: $${buyingPower.toFixed(2)}`);
      }
    }

    if (transaction_type === 'sell') {
      // Check if user owns enough shares
      const { data: portfolioItem, error: portfolioError } = await supabase
        .from('portfolios')
        .select('shares')
        .eq('user_id', user.id)
        .eq('symbol', symbol)
        .single();

      if (portfolioError && portfolioError.code !== 'PGRST116') { // Not found is okay - it just means they don't own any
        throw new Error(`Error checking existing shares: ${portfolioError.message}`);
      }

      if (!portfolioItem || portfolioItem.shares < shares) {
        throw new Error(`Insufficient shares. You have ${portfolioItem?.shares || 0} shares of ${symbol} but attempted to sell ${shares}`);
      }
    }

    // Determine transaction status based on execution type
    const status = execution_type === 'market' ? 'completed' : 'pending';

    // Log the transaction first
    const { data: transactionData, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        symbol,
        company_name: companyName,
        transaction_type,
        shares,
        price_per_share,
        total_amount,
        status
      })
      .select()
      .single();

    if (transactionError) {
      throw new Error(`Transaction error: ${transactionError.message}`);
    }

    // For market orders, update the portfolio immediately
    if (execution_type === 'market') {
      // Update user's buying power for buy orders
      if (transaction_type === 'buy') {
        const { error: updateBuyingPowerError } = await supabase
          .from('profiles')
          .update({ 
            buying_power: userProfile.buying_power - total_amount,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateBuyingPowerError) {
          throw new Error(`Error updating buying power: ${updateBuyingPowerError.message}`);
        }
      } else if (transaction_type === 'sell') {
        // Add funds back to user's buying power
        const { error: updateBuyingPowerError } = await supabase
          .from('profiles')
          .update({ 
            buying_power: userProfile.buying_power + total_amount,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateBuyingPowerError) {
          throw new Error(`Error updating buying power: ${updateBuyingPowerError.message}`);
        }
      }

      // Check if the stock is already in the portfolio
      const { data: existingStock, error: existingError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .eq('symbol', symbol)
        .maybeSingle();

      if (existingError) {
        throw new Error(`Error checking existing portfolio: ${existingError.message}`);
      }

      if (transaction_type === 'buy') {
        if (existingStock) {
          // Update existing position
          const newShares = existingStock.shares + shares;
          const newAveragePrice = ((existingStock.shares * existingStock.average_price) + total_amount) / newShares;
          
          const { error: updateError } = await supabase
            .from('portfolios')
            .update({
              shares: newShares,
              average_price: newAveragePrice,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingStock.id);

          if (updateError) {
            throw new Error(`Portfolio update error: ${updateError.message}`);
          }
        } else {
          // Create new position
          const { error: insertError } = await supabase
            .from('portfolios')
            .insert({
              user_id: user.id,
              symbol,
              company_name: companyName,
              shares,
              average_price: price_per_share
            });

          if (insertError) {
            throw new Error(`Portfolio insert error: ${insertError.message}`);
          }
        }
      } else if (transaction_type === 'sell') {
        // We already validated that the user has enough shares above
        const newShares = existingStock.shares - shares;
        
        if (newShares > 0) {
          // Update with remaining shares
          const { error: updateError } = await supabase
            .from('portfolios')
            .update({
              shares: newShares,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingStock.id);

          if (updateError) {
            throw new Error(`Portfolio update error: ${updateError.message}`);
          }
        } else {
          // Remove the position entirely
          const { error: deleteError } = await supabase
            .from('portfolios')
            .delete()
            .eq('id', existingStock.id);

          if (deleteError) {
            throw new Error(`Portfolio delete error: ${deleteError.message}`);
          }
        }
      }
    }

    // Return the transaction details
    return new Response(JSON.stringify({
      success: true,
      message: `${transaction_type === 'buy' ? 'Purchase' : 'Sale'} of ${shares} shares of ${symbol} ${execution_type === 'market' ? 'completed' : 'submitted as ' + execution_type + ' order'}`,
      transaction: transactionData
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Transaction error:', error.message);
    
    return new Response(JSON.stringify({
      success: false,
      message: error.message
    }), {
      status: 400,
      headers: corsHeaders
    });
  }
});
