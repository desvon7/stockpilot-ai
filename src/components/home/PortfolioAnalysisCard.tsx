
import React from 'react';
import { cn } from '@/lib/utils';

interface SectorAllocation {
  name: string;
  percentage: number;
  color: string;
}

interface PortfolioAnalysisCardProps {
  isInView: boolean;
}

const PortfolioAnalysisCard: React.FC<PortfolioAnalysisCardProps> = ({ isInView }) => {
  const sectors: SectorAllocation[] = [
    { name: 'Technology', percentage: 42, color: 'bg-primary' },
    { name: 'Healthcare', percentage: 18, color: 'bg-info' },
    { name: 'Consumer Cyclical', percentage: 15, color: 'bg-success' },
    { name: 'Financial Services', percentage: 12, color: 'bg-warning' },
    { name: 'Other Sectors', percentage: 13, color: 'bg-muted-foreground' },
  ];

  return (
    <div className={cn(
      'glass-card rounded-lg p-6 transition-all duration-700 transform',
      isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    )}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium">Portfolio Analysis</h3>
          <p className="text-muted-foreground">AI-optimized allocation</p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          93% Optimized
        </div>
      </div>
      
      <div className="space-y-4">
        {sectors.map((sector) => (
          <div key={sector.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{sector.name}</span>
              <span className="font-medium">{sector.percentage}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div className={`h-2 ${sector.color} rounded-full`} style={{ width: `${sector.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Our AI suggests this allocation based on your risk profile, market conditions, and financial goals.
        </p>
      </div>
    </div>
  );
};

export default PortfolioAnalysisCard;
