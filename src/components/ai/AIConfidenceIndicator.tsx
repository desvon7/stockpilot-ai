
import React from 'react';
import { cn } from '@/lib/utils';

interface AIConfidenceIndicatorProps {
  confidence: number;
}

const AIConfidenceIndicator: React.FC<AIConfidenceIndicatorProps> = ({ confidence }) => {
  return (
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
  );
};

export default AIConfidenceIndicator;
