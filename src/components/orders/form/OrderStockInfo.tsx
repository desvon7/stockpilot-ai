
import React from 'react';

interface OrderStockInfoProps {
  currentPrice?: number;
  availableShares?: number;
  orderTypeValue: 'buy' | 'sell';
}

const OrderStockInfo: React.FC<OrderStockInfoProps> = ({ 
  currentPrice, 
  availableShares, 
  orderTypeValue 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Current Price:</span>
        <span className="font-bold">
          ${currentPrice?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'Loading...'}
        </span>
      </div>
      
      {orderTypeValue === 'sell' && availableShares && availableShares > 0 && (
        <div className="flex justify-between items-center bg-muted p-2 rounded-md">
          <span className="text-sm font-medium">You own:</span>
          <span className="font-medium">{availableShares} shares</span>
        </div>
      )}
    </div>
  );
};

export default OrderStockInfo;
