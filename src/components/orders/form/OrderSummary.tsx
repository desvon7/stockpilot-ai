
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface OrderSummaryProps {
  estimatedTotal: number;
  buyingPower: number;
  orderTypeValue: 'buy' | 'sell';
  symbol: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  estimatedTotal,
  buyingPower,
  orderTypeValue,
  symbol
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-t border-border pt-3">
        <span className="text-sm font-medium">Estimated Total:</span>
        <span className="font-bold">
          ${estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
      
      {orderTypeValue === 'buy' && (
        <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md text-sm">
          <span className="text-muted-foreground">Available Buying Power:</span>
          <span className="font-medium">${buyingPower.toFixed(2)}</span>
        </div>
      )}
      
      <div className="flex items-start text-xs text-muted-foreground">
        <AlertCircle className="h-3 w-3 mr-1 mt-0.5" />
        <p>Market orders execute at current market price. Prices may vary slightly from displayed quote.</p>
      </div>
    </div>
  );
};

export default OrderSummary;
