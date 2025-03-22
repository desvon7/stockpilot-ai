
// Database operations for portfolio management

// Update existing position in portfolio
export const updateExistingPosition = async (existingStock, order, totalAmount, supabase) => {
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
export const createNewPosition = async (order, executionPrice, supabase) => {
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

// Update portfolio with remaining shares
export const updateRemainingShares = async (existingStock, newShares, supabase) => {
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
export const removePosition = async (existingStock, supabase) => {
  const { error: deleteError } = await supabase
    .from('portfolios')
    .delete()
    .eq('id', existingStock.id);

  if (deleteError) {
    throw new Error(`Portfolio delete error: ${deleteError.message}`);
  }
};
