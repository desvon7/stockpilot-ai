
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { corsHeaders } from './utils/cors.ts';
import { createSupabaseClient } from './utils/supabase.ts';
import { fetchPendingOrders } from './database/orders.ts';
import { processOrder } from './handlers/orderProcessing.ts';

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
