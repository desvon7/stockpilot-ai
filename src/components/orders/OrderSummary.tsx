
import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface OrderSummaryProps {
  estimatedTotal: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ estimatedTotal }) => {
  const isNegative = estimatedTotal < 0;
  const formattedTotal = Math.abs(estimatedTotal);
  
  return (
    <div className="flex justify-between items-center border-t border-border pt-3 mt-4">
      <span className="text-sm font-medium flex items-center">
        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
        Estimated Total:
      </span>
      <span className={`font-bold flex items-center ${isNegative ? 'text-destructive' : 'text-success'}`}>
        {isNegative ? <TrendingDown className="h-4 w-4 mr-1" /> : <TrendingUp className="h-4 w-4 mr-1" />}
        ${formattedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    </div>
  );
};

export default React.memo(OrderSummary);
