
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { ChevronRight, ArrowRight, Upload, CreditCard, RefreshCw, Bank } from 'lucide-react';

const Transfers: React.FC = () => {
  // Mock completed transfers history
  const transfers = [
    {
      type: 'Deposit to individual',
      source: 'Wells Fargo Everyday Checking',
      account: 'Individual',
      date: 'Jan 31',
      amount: 400.00
    },
    {
      type: 'Deposit to individual',
      source: 'Wells Fargo Everyday Checking',
      account: 'Individual',
      date: 'Jan 27',
      amount: 150.00
    }
  ];

  // Available funds to withdraw
  const availableFunds = [
    { type: 'Individual cash available', amount: 4.75 },
    { type: 'Spending cash available', amount: 0.00 },
    { type: 'Roth IRA cash available', amount: 0.00 }
  ];

  // Linked accounts
  const linkedAccounts = [
    {
      name: 'Wells Fargo Everyday Checking',
      type: 'Checking',
      maskedNumber: '••••',
      verified: true
    }
  ];

  return (
    <>
      <Helmet>
        <title>Transfers | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <nav className="flex space-x-4 text-sm font-medium">
              {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className={`${item === 'Transfers' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Start a transfer</h1>
          <p className="mb-6">
            Learn more about your <button className="text-primary">transfer limits</button>.
          </p>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex gap-4 border-b border-border p-4 cursor-pointer hover:bg-muted/30 transition-colors rounded">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              <ArrowRight className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">Transfer accounts</div>
              <div className="text-green-500 text-sm mb-1">For a limited time, get 2% extra with Gold.</div>
              <div className="text-muted-foreground text-sm">Transfer your outside brokerage accounts into Robinhood.</div>
            </div>
            <div className="self-center">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex gap-4 border-b border-border p-4 cursor-pointer hover:bg-muted/30 transition-colors rounded">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              <Bank className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">Transfer money</div>
              <div className="text-muted-foreground text-sm">Transfer money between your bank and your Robinhood account.</div>
            </div>
            <div className="self-center">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex gap-4 border-b border-border p-4 cursor-pointer hover:bg-muted/30 transition-colors rounded">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">Set up direct deposit</div>
              <div className="text-muted-foreground text-sm">Get your paycheck deposited directly into your Robinhood account.</div>
            </div>
            <div className="self-center">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex gap-4 border-b border-border p-4 cursor-pointer hover:bg-muted/30 transition-colors rounded">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              <Upload className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">Send a wire transfer</div>
              <div className="text-muted-foreground text-sm">Transfer to or from your brokerage account, typically within 1 business day.</div>
            </div>
            <div className="self-center">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Available to withdraw</h2>
          <p className="text-muted-foreground mb-4">Exclusions may apply, depending on your account type and activity.</p>
          
          {availableFunds.map((fund, index) => (
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
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Linked Accounts</h2>
          
          {linkedAccounts.map((account, index) => (
            <div key={index} className="flex justify-between items-center border-b border-border py-4">
              <div className="flex gap-4">
                <Bank className="w-8 h-8" />
                <div>
                  <div className="font-medium">{account.name}</div>
                  <div className="text-muted-foreground">{account.type} {account.maskedNumber}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{account.verified ? 'Verified' : 'Verification Needed'}</span>
                <Button variant="outline">Unlink</Button>
              </div>
            </div>
          ))}
          
          <Button variant="link" className="text-green-500 mt-4">Add New Account</Button>
        </div>
        
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
      </AccountLayout>
    </>
  );
};

export default Transfers;
