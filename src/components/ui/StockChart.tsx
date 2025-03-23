
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';

export type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';

interface StockChartProps {
  data: Array<{ date: string; price: number }>;
  positiveChange?: boolean;
  className?: string;
  minimal?: boolean;
  timeframe?: TimeRange;
}

const StockChart: React.FC<StockChartProps> = ({ 
  data, 
  positiveChange = true, 
  className,
  minimal = false,
  timeframe = '1M'
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>(timeframe);
  
  // Ensure data is properly formatted and sorted
  const formattedData = React.useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return Array(30).fill(0).map((_, i) => ({
        date: new Date(Date.now() - (30 - i) * 86400000).toISOString().split('T')[0],
        price: 100 + Math.random() * 10
      }));
    }
    
    // Create a copy to avoid modifying original data
    return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);
  
  const getFilteredData = () => {
    if (!formattedData.length) return [];
    
    const now = new Date();
    let filterDate = new Date();
    
    switch (timeRange) {
      case '1D':
        filterDate.setDate(now.getDate() - 1);
        break;
      case '1W':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case '1Y':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      case '5Y':
        filterDate.setFullYear(now.getFullYear() - 5);
        break;
      default:
        filterDate.setMonth(now.getMonth() - 1);
    }
    
    const filtered = formattedData.filter(item => new Date(item.date) >= filterDate);
    return filtered.length > 0 ? filtered : formattedData.slice(-30); // Fallback to last 30 days if filtered is empty
  };
  
  const filteredData = getFilteredData();
  const lineColor = positiveChange ? 'hsl(var(--success))' : 'hsl(var(--destructive))';
  const gradientColor = positiveChange ? 'hsl(var(--success))' : 'hsl(var(--destructive))';
  
  if (minimal) {
    return (
      <div className={cn('w-full h-16', className)}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={lineColor} 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  return (
    <div className={cn('w-full space-y-4', className)}>
      <div className="flex items-center justify-end space-x-2">
        {(['1D', '1W', '1M', '3M', '1Y', '5Y'] as TimeRange[]).map(range => (
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
      
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <XAxis 
              dataKey="date" 
              tickMargin={10}
              tickFormatter={(value) => {
                const date = new Date(value);
                if (timeRange === '1D') return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                if (timeRange === '1W' || timeRange === '1M') return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
              }}
              style={{ fontSize: '12px' }}
              domain={['dataMin', 'dataMax']}
              minTickGap={30}
              isAnimationActive={false}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tickFormatter={(value) => formatCurrency(value)}
              width={80}
              style={{ fontSize: '12px' }}
              isAnimationActive={false}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Price']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString('en-US', { 
                  weekday: 'short',
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                });
              }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
              isAnimationActive={false}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={lineColor} 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;
