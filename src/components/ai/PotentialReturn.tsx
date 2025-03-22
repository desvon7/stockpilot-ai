
import React from 'react';
import { cn } from '@/lib/utils';
import { formatPercent } from '@/utils/formatters';

interface PotentialReturnProps {
  percentDifference: number;
}

const PotentialReturn: React.FC<PotentialReturnProps> = ({ percentDifference }) => {
  const isPositive = percentDifference > 0;
  
  return (
    <span className={cn(
      'font-medium',
      isPositive ? 'text-green-500' : 'text-red-500'
    )}>
      {isPositive ? '+' : ''}{formatPercent(percentDifference/100)}
    </span>
  );
};

export default PotentialReturn;
