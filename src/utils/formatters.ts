
// Format currency values
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Format percentage values
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

// Get color class based on change value
export const getColorByChange = (change: number): string => {
  return change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-muted-foreground';
};

// Get arrow icon based on change value
export const getArrowByChange = (change: number): string => {
  return change > 0 ? '↑' : change < 0 ? '↓' : '→';
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
