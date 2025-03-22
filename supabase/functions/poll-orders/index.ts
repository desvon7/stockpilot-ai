
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
};

// Create Supabase client
const createSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Fetch pending orders from database
const fetchPendingOrders = async (supabase) => {
  const { data: pendingOrders, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Error fetching pending orders: ${error.message}`);
  }

  return pendingOrders || [];
};

// Process a single order
const processOrder = async (order, supabase) => {
  try {
    // Simple simulation of order execution
    // In a real system, you would connect to a brokerage API
    const shouldFill = Math.random() > 0.5;
    
    if (!shouldFill) {
      return { 
        id: order.id, 
        symbol: order.symbol,
        status: 'pending', 
        message: 'Order conditions not met yet' 
      };
    }

    // Update order status to completed
    const updatedOrder = await updateOrderStatus(order, supabase);
    
    // Update portfolio based on transaction type
    if (order.transaction_type === 'buy') {
      await handleBuyOrder(order, supabase);
    } else if (order.transaction_type === 'sell') {
      await handleSellOrder(order, supabase);
    }
    
    return { 
      id: order.id, 
      symbol: order.symbol,
      status: 'completed', 
      message: `Order executed at price $${updatedOrder.price_per_share}` 
    };
  } catch (error) {
    console.error(`Error processing order ${order.id}:`, error);
    return { 
      id: order.id,
      symbol: order.symbol,
      status: 'error',
      message: error.message
    };
  }
};

// Update order status in database
const updateOrderStatus = async (order, supabase) => {
  const executionPrice = order.limit_price || order.price_per_share;
  
  const { error, data } = await supabase
    .from('transactions')
    .update({ 
      status: 'completed',
      price_per_share: executionPrice
    })
    .eq('id', order.id)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error updating order status: ${error.message}`);
  }
  
  return data;
};

// Handle buy order portfolio updates
const handleBuyOrder = async (order, supabase) => {
  // Check if the stock is already in the portfolio
  const { data: existingStock, error: existingError } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', order.user_id)
    .eq('symbol', order.symbol)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Error checking existing portfolio: ${existingError.message}`);
  }

  const executionPrice = order.limit_price || order.price_per_share;
  const totalAmount = order.shares * executionPrice;

  if (existingStock) {
    // Update existing position
    await updateExistingPosition(existingStock, order, totalAmount, supabase);
  } else {
    // Create new position
    await createNewPosition(order, executionPrice, supabase);
  }
};

// Update existing position in portfolio
const updateExistingPosition = async (existingStock, order, totalAmount, supabase) => {
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
};

// Create new position in portfolio
const createNewPosition = async (order, executionPrice, supabase) => {
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
};

// Handle sell order portfolio updates
const handleSellOrder = async (order, supabase) => {
  const { data: existingStock, error: existingError } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', order.user_id)
    .eq('symbol', order.symbol)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Error checking existing portfolio: ${existingError.message}`);
  }

  if (!existingStock || existingStock.shares < order.shares) {
    throw new Error(`Insufficient shares for selling`);
  }
  
  const newShares = existingStock.shares - order.shares;
  
  if (newShares > 0) {
    // Update with remaining shares
    await updateRemainingShares(existingStock, newShares, supabase);
  } else {
    // Remove the position entirely
    await removePosition(existingStock, supabase);
  }
};

// Update portfolio with remaining shares
const updateRemainingShares = async (existingStock, newShares, supabase) => {
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
};

// Remove position from portfolio
const removePosition = async (existingStock, supabase) => {
  const { error: deleteError } = await supabase
    .from('portfolios')
    .delete()
    .eq('id', existingStock.id);

  if (deleteError) {
    throw new Error(`Portfolio delete error: ${deleteError.message}`);
  }
};

// Main handler function
serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const supabase = createSupabaseClient();
    
    // Get all pending orders
    const pendingOrders = await fetchPendingOrders(supabase);

    if (pendingOrders.length === 0) {
      return new Response(JSON.stringify({ message: 'No pending orders to process' }), {
        status: 200,
        headers: corsHeaders
      });
    }

    console.log(`Processing ${pendingOrders.length} pending orders`);

    // Process each pending order
    const results = await Promise.all(pendingOrders.map(order => processOrder(order, supabase)));

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
