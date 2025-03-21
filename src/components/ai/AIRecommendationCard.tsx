
import React from 'react';
import { AIRecommendation } from '@/services/aiService';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { ArrowUpRight, ArrowDownRight, MinusIcon, TrendingUp, ArrowRight, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
  className?: string;
}

const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  recommendation,
  className
}) => {
  const {
    symbol,
    name,
    recommendation: action,
    confidence,
    priceTarget,
    currentPrice,
    reasoning
  } = recommendation;
  
  const priceDifference = priceTarget - currentPrice;
  const percentDifference = (priceDifference / currentPrice) * 100;
  const isPositive = priceDifference > 0;
  
  const getActionColor = () => {
    switch (action) {
      case 'buy':
        return 'text-green-500 bg-green-500/10';
      case 'sell':
        return 'text-red-500 bg-red-500/10';
      case 'hold':
        return 'text-amber-500 bg-amber-500/10';
      default:
        return 'text-slate-500 bg-slate-500/10';
    }
  };
  
  const getActionIcon = () => {
    switch (action) {
      case 'buy':
        return <ArrowUpRight className="w-4 h-4" />;
      case 'sell':
        return <ArrowDownRight className="w-4 h-4" />;
      case 'hold':
        return <MinusIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };
  
  return (
    <div className={cn("glass-card p-5 rounded-lg", className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{symbol}</h3>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1",
              getActionColor()
            )}>
              {getActionIcon()}
              {action.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{formatCurrency(currentPrice)}</p>
          <p className="text-sm text-muted-foreground">Target: {formatCurrency(priceTarget)}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Potential return:</span>
          <span className={cn(
            'font-medium',
            isPositive ? 'text-green-500' : 'text-red-500'
          )}>
            {isPositive ? '+' : ''}{formatPercent(percentDifference/100)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">AI confidence:</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full',
                  confidence >= 0.8 ? 'bg-green-500' : 
                  confidence >= 0.6 ? 'bg-amber-500' : 'bg-red-500'
                )}
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium">{Math.round(confidence * 100)}%</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm mb-4">{reasoning}</p>
        <Link 
          to={`/stocks/${symbol}`}
          className="flex items-center text-sm font-medium text-primary hover:underline"
        >
          View detailed analysis
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default AIRecommendationCard;
