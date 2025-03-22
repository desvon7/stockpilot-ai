
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

interface StockStats {
  open: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  avgVolume: number;
}

interface StockStatsCardProps {
  stats: StockStats;
}

const StockStatsCard: React.FC<StockStatsCardProps> = ({ stats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Stats</CardTitle>
        <CardDescription>Key metrics for today's trading</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Open</span>
            <span className="font-medium">{formatCurrency(stats.open)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Previous Close</span>
            <span className="font-medium">{formatCurrency(stats.previousClose)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Day High</span>
            <span className="font-medium">{formatCurrency(stats.dayHigh)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Day Low</span>
            <span className="font-medium">{formatCurrency(stats.dayLow)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Volume</span>
            <span className="font-medium">{stats.volume.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg. Volume</span>
            <span className="font-medium">{stats.avgVolume.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockStatsCard;
