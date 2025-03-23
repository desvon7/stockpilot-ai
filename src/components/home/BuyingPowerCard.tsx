
import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface BuyingPowerCardProps {
  buyingPower: number;
}

const BuyingPowerCard: React.FC<BuyingPowerCardProps> = ({ buyingPower }) => {
  return (
    <div className="flex justify-between items-center p-4 border border-border rounded-lg mb-8">
      <div className="flex items-center">
        <span className="font-medium mr-1">Buying power</span>
        <button className="text-muted-foreground">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
          </svg>
        </button>
      </div>
      <div className="flex items-center">
        <span className="font-medium mr-2">{formatCurrency(buyingPower)}</span>
        <button className="text-muted-foreground">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M7 10l5 5 5-5z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BuyingPowerCard;
