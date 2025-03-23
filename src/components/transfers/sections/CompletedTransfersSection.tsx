
import React from 'react';

interface Transfer {
  type: string;
  source: string;
  account: string;
  date: string;
  amount: number;
}

interface CompletedTransfersSectionProps {
  transfers: Transfer[];
}

const CompletedTransfersSection: React.FC<CompletedTransfersSectionProps> = ({ transfers }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Completed Transfers</h2>
      
      {transfers.map((transfer, index) => (
        <div key={index} className="flex justify-between items-center border-b border-border py-4">
          <div>
            <div className="font-medium">{transfer.type} from {transfer.source}</div>
            <div className="text-muted-foreground">{transfer.account} • {transfer.date}</div>
          </div>
          <div className="font-medium text-green-500">+${transfer.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
};

export default CompletedTransfersSection;
