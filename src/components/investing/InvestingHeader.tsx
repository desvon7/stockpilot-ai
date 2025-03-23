
import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface InvestingHeaderProps {
  totalPortfolioValue: number;
}

const InvestingHeader: React.FC<InvestingHeaderProps> = ({ totalPortfolioValue }) => {
  return (
    <div className="border-b border-border pb-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <nav className="flex space-x-4 text-sm font-medium overflow-x-auto">
          {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
            <a 
              key={item} 
              href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
              className={`${item === 'Investing' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1 whitespace-nowrap`}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
      
      <h1 className="text-3xl font-bold">${formatCurrency(totalPortfolioValue)}</h1>
      
      <div className="flex items-center text-green-500">
        <span>▲ $12.46 (2.52%) Today</span>
      </div>
    </div>
  );
};

export default InvestingHeader;
