
import React from 'react';
import { Button } from '@/components/ui/button';
import { LineChart, BarChart3 } from 'lucide-react';
import { TimeRange } from '@/components/ui/StockChart';

interface StockChartControlsProps {
  timeframe: TimeRange;
  setTimeframe: React.Dispatch<React.SetStateAction<TimeRange>>;
}

const StockChartControls: React.FC<StockChartControlsProps> = ({
  timeframe,
  setTimeframe
}) => {
  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex space-x-2">
        <Button
          variant={timeframe === '1D' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeframe('1D')}
        >
          1D
        </Button>
        <Button
          variant={timeframe === '1W' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeframe('1W')}
        >
          1W
        </Button>
        <Button
          variant={timeframe === '1M' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeframe('1M')}
        >
          1M
        </Button>
        <Button
          variant={timeframe === '3M' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeframe('3M')}
        >
          3M
        </Button>
        <Button
          variant={timeframe === '1Y' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeframe('1Y')}
        >
          1Y
        </Button>
        <Button
          variant={timeframe === '5Y' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeframe('5Y')}
        >
          5Y
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <LineChart className="h-4 w-4 mr-2" />
          Line
        </Button>
        <Button variant="outline" size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          Candle
        </Button>
      </div>
    </div>
  );
};

export default StockChartControls;
