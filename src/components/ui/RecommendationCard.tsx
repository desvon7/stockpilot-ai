
import React from 'react';
import { cn } from '@/lib/utils';
import { Recommendation } from '@/utils/mockData';
import { formatCurrency, formatPercent } from '@/utils/formatters';

interface RecommendationCardProps {
  recommendation: Recommendation;
  className?: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  className 
}) => {
  const { symbol, name, type, confidence, reason, targetPrice, currentPrice } = recommendation;
  
  const priceDifference = targetPrice - currentPrice;
  const priceDifferencePercent = (priceDifference / currentPrice) * 100;
  
  const getTypeColor = () => {
    switch (type) {
      case 'buy':
        return 'bg-success/10 text-success';
      case 'sell':
        return 'bg-destructive/10 text-destructive';
      case 'hold':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  return (
    <div className={cn('glass-card rounded-lg p-5', className)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{symbol}</h3>
            <span className={cn(
              'px-2 py-0.5 text-xs font-medium rounded-full uppercase',
              getTypeColor()
            )}>
              {type}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">{formatCurrency(currentPrice)}</p>
          <p className="text-sm font-medium">
            Target: {formatCurrency(targetPrice)}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Potential return:</span>
          <span className={cn(
            'font-medium',
            priceDifference > 0 ? 'text-success' : 'text-destructive'
          )}>
            {formatPercent(priceDifferencePercent)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">AI confidence:</span>
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full',
                confidence >= 0.7 ? 'bg-success' : confidence >= 0.4 ? 'bg-warning' : 'bg-destructive'
              )}
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm">{reason}</p>
      </div>
    </div>
  );
};

export default RecommendationCard;
