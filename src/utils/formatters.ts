
import { format, parseISO, isValid } from 'date-fns';

export const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

// Alias for formatPercentage for consistency with component usage
export const formatPercent = formatPercentage;

export const formatNumber = (value: number): string => {
  return value.toLocaleString('en-US');
};

export const formatCompactNumber = (value: number): string => {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(value);
};

/**
 * Format a large currency value with appropriate notation (K, M, B)
 * @param value - The value to format
 * @returns Formatted large currency string
 */
export const formatLargeCurrency = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  } else {
    return formatCurrency(value);
  }
};

/**
 * Get appropriate text color class based on change value
 * @param change - The change value
 * @returns Tailwind text color class
 */
export const getColorByChange = (change: number): string => {
  if (change > 0) return 'text-green-500';
  if (change < 0) return 'text-red-500';
  return 'text-muted-foreground';
};

/**
 * Get appropriate background color class based on change value
 * @param change - The change value
 * @returns Tailwind background color class
 */
export const getBgColorByChange = (change: number): string => {
  if (change > 0) return 'bg-green-100 dark:bg-green-900/20';
  if (change < 0) return 'bg-red-100 dark:bg-red-900/20';
  return 'bg-muted';
};

/**
 * Get appropriate arrow indicator based on change value
 * @param change - The change value
 * @returns Arrow indicator string
 */
export const getArrowByChange = (change: number): string => {
  if (change > 0) return '↑';
  if (change < 0) return '↓';
  return '–';
};

/**
 * Format a date string or Date object into a human-readable format
 * @param dateString - Date string or Date object
 * @param formatStr - Optional format string (default: 'MMM d, yyyy')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | Date, formatStr = 'MMM d, yyyy'): string => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return 'Invalid date';
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format a date with time
 * @param dateString - Date string or Date object
 * @returns Formatted date with time
 */
export const formatDateTime = (dateString: string | Date): string => {
  return formatDate(dateString, 'MMM d, yyyy h:mm a');
};

/**
 * Format price with appropriate decimal places based on value
 * @param price - Price value
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  } else if (price >= 1) {
    return price.toLocaleString('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  } else {
    return price.toLocaleString('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });
  }
};
