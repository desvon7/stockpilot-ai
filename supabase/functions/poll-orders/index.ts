
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
};

// This function should be scheduled to run periodically to check pending orders
serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all pending orders
    const { data: pendingOrders, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (fetchError) {
      throw new Error(`Error fetching pending orders: ${fetchError.message}`);
    }

    if (!pendingOrders || pendingOrders.length === 0) {
      return new Response(JSON.stringify({ message: 'No pending orders to process' }), {
        status: 200,
        headers: corsHeaders
      });
    }

    console.log(`Processing ${pendingOrders.length} pending orders`);

    // Process each pending order
    const results = await Promise.all(pendingOrders.map(async (order) => {
      try {
        // Simple simulation of order execution
        // In a real system, you would connect to a brokerage API
        // and check if the order conditions have been met
        
        // For limit buy orders: Check if market price is <= limit price
        // For limit sell orders: Check if market price is >= limit price
        
        // For this simulation, we'll randomly decide if the order should be filled
        const shouldFill = Math.random() > 0.5;
        
        if (shouldFill) {
          // Update the order status to completed
          const { error: updateError } = await supabase
            .from('transactions')
            .update({ 
              status: 'completed',
              // In a real system, you would get the actual execution price
              // from the brokerage API
              price_per_share: order.limit_price || order.price_per_share
            })
            .eq('id', order.id);
          
          if (updateError) {
            throw new Error(`Error updating order status: ${updateError.message}`);
          }
          
          // Now update the portfolio
          // Check if the stock is already in the portfolio
          const { data: existingStock, error: existingError } = await supabase
            .from('portfolios')
            .select('*')
            .eq('user_id', order.user_id)
            .eq('symbol', order.symbol)
            .single();

          if (existingError && existingError.code !== 'PGRST116') { // Not found is okay
            throw new Error(`Error checking existing portfolio: ${existingError.message}`);
          }

          const executionPrice = order.limit_price || order.price_per_share;
          const totalAmount = order.shares * executionPrice;

          if (order.transaction_type === 'buy') {
            if (existingStock) {
              // Update existing position
              const newShares = existingStock.shares + order.shares;
              const newAveragePrice = ((existingStock.shares * existingStock.average_price) + totalAmount) / newShares;
              
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
                  user_id: order.user_id,
                  symbol: order.symbol,
                  company_name: order.company_name,
                  shares: order.shares,
                  average_price: executionPrice
                });

              if (insertError) {
                throw new Error(`Portfolio insert error: ${insertError.message}`);
              }
            }
          } else if (order.transaction_type === 'sell') {
            if (!existingStock || existingStock.shares < order.shares) {
              throw new Error(`Insufficient shares for selling`);
            }
            
            const newShares = existingStock.shares - order.shares;
            
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
          
          return { 
            id: order.id, 
            symbol: order.symbol,
            status: 'completed', 
            message: `Order executed at price $${executionPrice}` 
          };
        } else {
          // In a real system, you might check if the order has expired
          // or if it's been open too long, etc.
          return { 
            id: order.id, 
            symbol: order.symbol,
            status: 'pending', 
            message: 'Order conditions not met yet' 
          };
        }
      } catch (error) {
        console.error(`Error processing order ${order.id}:`, error);
        return { 
          id: order.id,
          symbol: order.symbol,
          status: 'error',
          message: error.message
        };
      }
    }));

    return new Response(JSON.stringify({
      processed: results.length,
      completed: results.filter(r => r.status === 'completed').length,
      results
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Order polling error:', error.message);
    
    return new Response(JSON.stringify({
      success: false,
      message: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
