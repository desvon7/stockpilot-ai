
// Historical Data for Charts
export const generateChartData = (days = 30, volatility = 0.02, trend = 0.001) => {
  const now = new Date();
  const data = [];
  let price = Math.random() * 100 + 50; // Random starting price between 50 and 150

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some randomness to the price
    const change = price * (Math.random() * volatility * 2 - volatility) + (trend * price);
    price += change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(1, Math.round(price * 100) / 100) // Ensure price doesn't go below 1
    });
  }
  
  return data;
};
