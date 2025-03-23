
import React, { useState, useMemo } from 'react';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { usePortfolioHistory } from '@/hooks/usePortfolioHistory';
import { Loader2 } from 'lucide-react';
import { PortfolioHistoryItem } from '@/services/portfolioService';

type TimeRange = '1W' | '1M' | '3M' | '1Y' | 'All';

interface PortfolioPerformanceProps {
  history: PortfolioHistoryItem[] | undefined;
  isLoading: boolean;
  className?: string;
}

const PortfolioPerformance: React.FC<PortfolioPerformanceProps> = ({ history, isLoading, className }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const { history: historyData, isLoading: loading, error } = usePortfolioHistory();
  
  const filteredData = useMemo(() => {
    if (!historyData) return [];
    
    const now = new Date();
    let filterDate = new Date();
    
    switch (timeRange) {
      case '1W':
        filterDate = subDays(now, 7);
        break;
      case '1M':
        filterDate = subMonths(now, 1);
        break;
      case '3M':
        filterDate = subMonths(now, 3);
        break;
      case '1Y':
        filterDate = subYears(now, 1);
        break;
      case 'All':
        return historyData;
      default:
        filterDate = subMonths(now, 1);
    }
    
    return historyData.filter(item => new Date(item.date) >= filterDate);
  }, [historyData, timeRange]);
  
  if (isLoading || loading) {
    return (
      <div className={cn('glass-card rounded-lg p-6 flex justify-center items-center', className)} style={{ minHeight: '300px' }}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading performance data...</span>
      </div>
    );
  }
  
  if (error || !historyData) {
    return (
      <div className={cn('glass-card rounded-lg p-6 text-center', className)} style={{ minHeight: '300px' }}>
        <h2 className="text-2xl font-semibold mb-4">Portfolio Performance</h2>
        <p className="text-destructive">{error ? 'Error loading performance data.' : 'No performance data available.'}</p>
        {error && <p className="text-sm mt-2">{(error as Error).message}</p>}
      </div>
    );
  }
  
  // Calculate performance metrics
  const firstValue = filteredData[0]?.totalValue || 0;
  const lastValue = filteredData[filteredData.length - 1]?.totalValue || 0;
  const absoluteChange = lastValue - firstValue;
  const percentChange = firstValue > 0 ? (absoluteChange / firstValue) * 100 : 0;
  
  return (
    <div className={cn('glass-card rounded-lg p-6', className)}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Portfolio Performance</h2>
        <div className="flex items-center space-x-2">
          {(['1W', '1M', '3M', '1Y', 'All'] as TimeRange[]).map(range => (
            <button
              key={range}
              className={cn(
                'px-3 py-1 text-sm rounded-md transition-colors',
                timeRange === range 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-secondary'
              )}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-muted/40 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Current Value</p>
          <p className="text-2xl font-semibold">{formatCurrency(lastValue)}</p>
        </div>
        
        <div className="p-4 bg-muted/40 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">{timeRange} Change</p>
          <p className={cn('text-2xl font-semibold', absoluteChange >= 0 ? 'text-green-500' : 'text-red-500')}>
            {absoluteChange >= 0 ? '+' : ''}{formatCurrency(absoluteChange)} ({percentChange.toFixed(2)}%)
          </p>
        </div>
        
        <div className="p-4 bg-muted/40 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Starting Value</p>
          <p className="text-2xl font-semibold">{formatCurrency(firstValue)}</p>
        </div>
      </div>
      
      <div className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => {
                const d = new Date(date);
                if (timeRange === '1W') return format(d, 'EEE');
                if (timeRange === '1M') return format(d, 'MMM d');
                if (timeRange === '3M') return format(d, 'MMM d');
                return format(d, 'MMM yyyy');
              }}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              width={80}
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), 'Value']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return format(date, 'MMMM d, yyyy');
              }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalValue"
              name="Portfolio Value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioPerformance;
