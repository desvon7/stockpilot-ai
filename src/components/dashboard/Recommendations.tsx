
import React from 'react';
import { cn } from '@/lib/utils';
import { Recommendation } from '@/utils/mockData';
import RecommendationCard from '@/components/ui/RecommendationCard';
import { Brain } from 'lucide-react';

interface RecommendationsProps {
  recommendations: Recommendation[];
  className?: string;
}

const Recommendations: React.FC<RecommendationsProps> = ({ 
  recommendations, 
  className 
}) => {
  const buyRecommendations = recommendations.filter(rec => rec.type === 'buy');
  const otherRecommendations = recommendations.filter(rec => rec.type !== 'buy');
  
  return (
    <div className={cn('space-y-6', className)}>
      <div className="glass-card rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 rounded-full p-2">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">AI Recommendations</h2>
            <p className="text-muted-foreground">Personalized insights based on your portfolio and market conditions</p>
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-5 mb-6">
          <h3 className="font-medium mb-2">Market Insight</h3>
          <p className="text-muted-foreground">
            Based on current market conditions and your portfolio composition, our AI suggests focusing on technology and healthcare sectors while maintaining a diversified approach.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="bg-success/10 text-success rounded-lg p-3">
              <p className="font-medium">Buy</p>
              <p className="text-sm">{buyRecommendations.length} stocks</p>
            </div>
            <div className="bg-warning/10 text-warning rounded-lg p-3">
              <p className="font-medium">Hold</p>
              <p className="text-sm">{recommendations.filter(r => r.type === 'hold').length} stocks</p>
            </div>
            <div className="bg-destructive/10 text-destructive rounded-lg p-3">
              <p className="font-medium">Sell</p>
              <p className="text-sm">{recommendations.filter(r => r.type === 'sell').length} stocks</p>
            </div>
          </div>
        </div>
        
        {buyRecommendations.length > 0 && (
          <div className="mb-8">
            <h3 className="font-medium text-lg mb-3">Top Buy Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {buyRecommendations.map(rec => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        )}
        
        {otherRecommendations.length > 0 && (
          <div>
            <h3 className="font-medium text-lg mb-3">Other Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherRecommendations.map(rec => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
