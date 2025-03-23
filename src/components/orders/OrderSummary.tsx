
import React from 'react';

interface OrderSummaryProps {
  estimatedTotal: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ estimatedTotal }) => {
  return (
    <div className="flex justify-between items-center border-t border-border pt-3">
      <span className="text-sm font-medium">Estimated Total:</span>
      <span className="font-bold">
        ${estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    </div>
  );
};

export default OrderSummary;
