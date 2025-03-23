
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHistoricalData, PolygonHistoricalData } from '@/services/polygonService';

type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y';

interface ChartDataPoint {
  date: string;
  price: number;
  volume?: number;
}

interface UsePolygonChartDataProps {
  symbol: string;
  timeRange?: TimeRange;
  enabled?: boolean;
}

export const usePolygonChartData = ({
  symbol,
  timeRange = '1M',
  enabled = true
}: UsePolygonChartDataProps) => {
  const [formattedData, setFormattedData] = useState<ChartDataPoint[]>([]);
  
  // Calculate date range based on selected time frame
  const getDateRange = () => {
    const now = new Date();
    const end = now.toISOString().split('T')[0]; // Today in YYYY-MM-DD format
    let start = '';
    let resolution: 'minute' | 'hour' | 'day' | 'week' | 'month' = 'day';
    
    switch (timeRange) {
      case '1D':
        // For 1 day, use yesterday to today
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        start = yesterday.toISOString().split('T')[0];
        resolution = 'minute';
        break;
      case '1W':
        // Last 7 days
        const lastWeek = new Date(now);
        lastWeek.setDate(now.getDate() - 7);
        start = lastWeek.toISOString().split('T')[0];
        resolution = 'hour';
        break;
      case '1M':
        // Last 30 days
        const lastMonth = new Date(now);
        lastMonth.setDate(now.getDate() - 30);
        start = lastMonth.toISOString().split('T')[0];
        resolution = 'day';
        break;
      case '3M':
        // Last 90 days
        const last3Months = new Date(now);
        last3Months.setDate(now.getDate() - 90);
        start = last3Months.toISOString().split('T')[0];
        resolution = 'day';
        break;
      case '6M':
        // Last 180 days
        const last6Months = new Date(now);
        last6Months.setDate(now.getDate() - 180);
        start = last6Months.toISOString().split('T')[0];
        resolution = 'day';
        break;
      case '1Y':
        // Last 365 days
        const lastYear = new Date(now);
        lastYear.setFullYear(now.getFullYear() - 1);
        start = lastYear.toISOString().split('T')[0];
        resolution = 'day';
        break;
      case '5Y':
        // Last 5 years
        const last5Years = new Date(now);
        last5Years.setFullYear(now.getFullYear() - 5);
        start = last5Years.toISOString().split('T')[0];
        resolution = 'week';
        break;
      default:
        // Default to 1 month
        const defaultLastMonth = new Date(now);
        defaultLastMonth.setDate(now.getDate() - 30);
        start = defaultLastMonth.toISOString().split('T')[0];
        resolution = 'day';
    }
    
    return { start, end, resolution };
  };
  
  const { start, end, resolution } = getDateRange();
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['polygon-chart', symbol, timeRange],
    queryFn: () => getHistoricalData(symbol, start, end, resolution),
    enabled: !!symbol && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Process and format the data for charting
  useEffect(() => {
    if (data?.results) {
      const chartData = data.results.map((bar) => ({
        date: new Date(bar.t).toISOString(),
        price: bar.c,
        volume: bar.v
      }));
      
      // Sort by date ascending
      chartData.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      setFormattedData(chartData);
    }
  }, [data]);
  
  return {
    data: formattedData,
    originalData: data,
    isLoading,
    error,
    refetch
  };
};

export default usePolygonChartData;
