
// Database operations for orders

// Fetch pending orders from database
export const fetchPendingOrders = async (supabase) => {
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

// Update order status in database
export const updateOrderStatus = async (order, supabase) => {
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
