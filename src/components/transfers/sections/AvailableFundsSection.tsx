
import React from 'react';

interface Fund {
  type: string;
  amount: number;
}

interface AvailableFundsSectionProps {
  funds: Fund[];
}

const AvailableFundsSection: React.FC<AvailableFundsSectionProps> = ({ funds }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3">Available to withdraw</h2>
      <p className="text-muted-foreground mb-4">Exclusions may apply, depending on your account type and activity.</p>
      
      {funds.map((fund, index) => (
        <div key={index} className="flex justify-between items-center py-3">
          <div className="flex items-center gap-2">
            {fund.type}
            <button className="text-muted-foreground">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
              </svg>
            </button>
          </div>
          <div className="font-medium">${fund.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
};

export default AvailableFundsSection;
