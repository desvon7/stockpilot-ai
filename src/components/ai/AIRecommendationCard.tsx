
import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AIRecommendationBadge from './AIRecommendationBadge';
import AIConfidenceIndicator from './AIConfidenceIndicator';
import PotentialReturn from './PotentialReturn';

// Update the AIRecommendation interface to include timestamp
export interface AIRecommendation {
  symbol: string;
  name: string;
  recommendation: string;
  confidence: number;
  priceTarget: number;
  currentPrice: number;
  reasoning: string;
  timestamp: string;
}

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
  
  return (
    <div className={cn("glass-card p-5 rounded-lg", className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{symbol}</h3>
            <AIRecommendationBadge action={action} />
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
          <PotentialReturn percentDifference={percentDifference} />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">AI confidence:</span>
          <AIConfidenceIndicator confidence={confidence} />
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
