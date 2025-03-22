
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, MinusIcon } from 'lucide-react';

interface AIRecommendationBadgeProps {
  action: string;
}

const AIRecommendationBadge: React.FC<AIRecommendationBadgeProps> = ({ action }) => {
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
    <span className={cn(
      "px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1",
      getActionColor()
    )}>
      {getActionIcon()}
      {action.toUpperCase()}
    </span>
  );
};

export default AIRecommendationBadge;
