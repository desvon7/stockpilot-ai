
import { updateOrderStatus } from '../database/orders.ts';
import { 
  updateExistingPosition, 
  createNewPosition, 
  updateRemainingShares, 
  removePosition 
} from '../database/portfolio.ts';

// Process a single order
export const processOrder = async (order, supabase) => {
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

// Handle buy order portfolio updates
export const handleBuyOrder = async (order, supabase) => {
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

// Handle sell order portfolio updates
export const handleSellOrder = async (order, supabase) => {
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
