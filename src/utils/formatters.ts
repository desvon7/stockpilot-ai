
/**
 * Format a number as a currency string
 * @param amount The number to format
 * @param minimumFractionDigits Minimum number of decimal places (default: 2)
 * @param maximumFractionDigits Maximum number of decimal places (default: 2)
 * @returns Formatted currency string without the currency symbol
 */
export const formatCurrency = (
  amount: number,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
};

/**
 * Format a number as a percentage string
 * @param value The number to format (0.1 for 10%)
 * @param minimumFractionDigits Minimum number of decimal places (default: 2)
 * @param maximumFractionDigits Maximum number of decimal places (default: 2)
 * @returns Formatted percentage string without the % symbol
 */
export const formatPercentage = (
  value: number,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value).replace('%', '');
};

/**
 * Alias for formatPercentage for compatibility
 */
export const formatPercent = formatPercentage;

/**
 * Format a number as large currency (K, M, B)
 * @param amount The number to format
 * @returns Formatted currency with K, M, B suffix
 */
export const formatLargeCurrency = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(2)}B`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(2)}K`;
  }
  return formatCurrency(amount);
};

/**
 * Get color class based on value change (positive/negative)
 * @param change The change value
 * @returns Tailwind text color class
 */
export const getColorByChange = (change: number): string => {
  return change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-500';
};

/**
 * Get background color class based on value change (positive/negative)
 * @param change The change value
 * @returns Tailwind background color class
 */
export const getBgColorByChange = (change: number): string => {
  return change > 0 ? 'bg-green-500' : change < 0 ? 'bg-red-500' : 'bg-gray-500';
};

/**
 * Get arrow symbol based on value change
 * @param change The change value
 * @returns Arrow symbol (▲, ▼, or -)
 */
export const getArrowByChange = (change: number): string => {
  return change > 0 ? '▲' : change < 0 ? '▼' : '-';
};
