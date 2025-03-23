
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

export const formatNumber = (value: number): string => {
  return value.toLocaleString('en-US');
};

export const formatCompactNumber = (value: number): string => {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(value);
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
