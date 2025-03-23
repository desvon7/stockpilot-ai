
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency, formatPercent, getColorByChange } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface PortfolioHoldingsTabProps {
  portfolio: any[] | null;
  isLoading: boolean;
}

const PortfolioHoldingsTab: React.FC<PortfolioHoldingsTabProps> = ({ portfolio, isLoading }) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="col-span-full text-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading your holdings...</p>
      </div>
    );
  }
  
  if (!portfolio || portfolio.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No Holdings Yet</h3>
          <p className="text-muted-foreground mb-6">Start your investment journey by adding stocks to your portfolio</p>
          <Button onClick={() => navigate('/stocks')}>
            Browse Stocks
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {portfolio.map((item) => (
        <Card key={item.symbol} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback>{item.symbol.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{item.symbol}</h3>
                  <p className="text-xs text-muted-foreground">{item.company_name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(item.average_price)}</div>
                <div className={cn("text-sm", getColorByChange(item.profit_loss || 0))}>
                  {item.profit_loss_percent && item.profit_loss_percent > 0 ? '+' : ''}
                  {formatPercent(item.profit_loss_percent || 0)}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Shares</span>
                <span>{item.shares}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Market Value</span>
                <span>{formatCurrency(item.total_value || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">P/L</span>
                <span className={cn(getColorByChange(item.profit_loss || 0))}>
                  {formatCurrency(item.profit_loss || 0)}
                </span>
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4" onClick={() => navigate(`/stocks/${item.symbol}`)}>
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PortfolioHoldingsTab;
