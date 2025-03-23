
import React, { useState } from 'react';
import { usePolygonChartData } from '@/hooks/usePolygonChartData';
import StockChart, { TimeRange } from '@/components/ui/StockChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PolygonStockChartProps {
  symbol: string;
  title?: string;
  description?: string;
  className?: string;
  onTimeRangeChange?: (range: TimeRange) => void;
}

const PolygonStockChart: React.FC<PolygonStockChartProps> = ({
  symbol,
  title = 'Stock Price History',
  description = 'Historical price data powered by Polygon.io',
  className,
  onTimeRangeChange
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('1M');
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = usePolygonChartData({
    symbol,
    timeRange: selectedTimeRange
  });
  
  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    }
  };
  
  // Check if price has increased or decreased over the period
  const isPositive = () => {
    if (data && data.length >= 2) {
      const firstPrice = data[0].price;
      const lastPrice = data[data.length - 1].price;
      return lastPrice >= firstPrice;
    }
    return true; // Default to positive
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {error && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full" />
            <div className="flex justify-end space-x-2">
              {['1D', '1W', '1M', '3M', '1Y'].map((_, i) => (
                <Skeleton key={i} className="h-6 w-10" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <AlertCircle className="h-12 w-12 mb-4 text-destructive/70" />
            <p>Failed to load chart data</p>
            <p className="text-sm mt-2">There was an error fetching data from Polygon API</p>
          </div>
        ) : (
          <StockChart 
            data={data} 
            positiveChange={isPositive()} 
            timeframe={selectedTimeRange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PolygonStockChart;
