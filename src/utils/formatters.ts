
/**
 * Format a date string to a readable format
 */
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

/**
 * Format a number as currency (USD)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a large number as currency with abbreviations (K, M, B)
 */
export const formatLargeCurrency = (value: number): string => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return formatCurrency(value);
};

/**
 * Format a number as percentage
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

/**
 * Alias for formatPercentage to maintain backward compatibility
 */
export const formatPercent = formatPercentage;

/**
 * Format a large number with abbreviations (K, M, B)
 */
export const formatLargeNumber = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

/**
 * Format a number with commas as thousands separators
 */
export const formatNumberWithCommas = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Get text color class based on numeric change
 */
export const getColorByChange = (change: number): string => {
  if (change > 0) return "text-green-600 dark:text-green-500";
  if (change < 0) return "text-red-600 dark:text-red-500";
  return "text-gray-600 dark:text-gray-400";
};

/**
 * Get background color class based on numeric change
 */
export const getBgColorByChange = (change: number): string => {
  if (change > 0) return "bg-green-100 dark:bg-green-900/30";
  if (change < 0) return "bg-red-100 dark:bg-red-900/30";
  return "bg-gray-100 dark:bg-gray-800";
};

/**
 * Get arrow icon based on numeric change
 */
export const getArrowByChange = (change: number): string => {
  if (change > 0) return "↑";
  if (change < 0) return "↓";
  return "—";
};
