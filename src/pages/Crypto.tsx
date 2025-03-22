
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { ChevronRight, Info } from 'lucide-react';

const Crypto: React.FC = () => {
  // Mock crypto transaction history
  const transactions = [
    {
      type: 'sent',
      symbol: 'XLM',
      date: 'Jan 25',
      amount: -923.48,
      value: 398.25
    },
    {
      type: 'sent',
      symbol: 'XLM',
      date: 'Jan 23',
      amount: -346.81,
      value: 149.38
    },
    {
      type: 'sent',
      symbol: 'XLM',
      date: 'Jan 18',
      amount: -312.95,
      value: 149.02
    }
  ];

  return (
    <>
      <Helmet>
        <title>Crypto | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <nav className="flex space-x-4 text-sm font-medium">
              {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className={`${item === 'Crypto' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          
          <h1 className="text-3xl font-bold mb-6">Crypto Transfer Limits</h1>
          
          <div className="mb-6">
            <div className="text-muted-foreground">Receiving Crypto</div>
            <div className="text-2xl font-bold">Unlimited</div>
          </div>
          
          <div className="mb-6">
            <div className="text-muted-foreground">Sending Crypto</div>
            <div className="text-2xl font-bold">10 transfers or $5,000.00 every 24 hours</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent History</h2>
          <Button variant="link">Show more</Button>
        </div>
        
        <div className="space-y-6">
          {transactions.map((transaction, index) => (
            <div key={index} className="border-b border-border pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{transaction.symbol} {transaction.type}</div>
                  <div className="text-sm text-muted-foreground">{transaction.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{transaction.amount} {transaction.symbol}</div>
                  <div className="text-sm text-muted-foreground">est. ${transaction.value.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12">
          <p className="text-muted-foreground">
            Transfer limits are a required part of our regulatory compliance measures and count the last 24 hours of activity.
            <button className="ml-2 text-primary">Learn more</button>
          </p>
        </div>
      </AccountLayout>
    </>
  );
};

export default Crypto;
