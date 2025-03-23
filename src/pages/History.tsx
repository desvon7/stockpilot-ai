
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';

const History: React.FC = () => {
  const [account, setAccount] = useState('all');
  const [type, setType] = useState('all');
  
  // Mock transaction history data
  const transactions = [
    {
      type: 'Deposit to individual',
      details: 'Individual • Jan 31',
      source: 'Wells Fargo Everyday Checking',
      amount: '+$400.00'
    },
    {
      type: 'XLM sent',
      details: 'Jan 25',
      value: '-923.48 XLM',
      estimatedValue: 'est. $398.25'
    },
    {
      type: 'XLM Market Buy',
      details: 'Jan 25',
      value: '923.48 Stellar Lumens at $0.434212',
      amount: '$400.99'
    },
    {
      type: 'XLM sent',
      details: 'Jan 23',
      value: '-346.81 XLM',
      estimatedValue: 'est. $149.38'
    },
    {
      type: 'XLM Market Buy',
      details: 'Jan 23',
      value: '346.81 Stellar Lumens at $0.432555',
      amount: '$150.02'
    },
    {
      type: 'Invesco Solar ETF Market Sell',
      details: 'Individual • Jan 23',
      value: '4.753546 shares at $32.55',
      amount: '$154.73'
    },
    {
      type: 'Deposit to individual',
      details: 'Individual • Jan 22',
      source: 'Wells Fargo Everyday Checking',
      amount: '+$100.00'
    },
    {
      type: 'Deposit to individual',
      details: 'Individual • Jan 27',
      source: 'Wells Fargo Everyday Checking',
      amount: '+$150.00'
    }
  ];

  return (
    <>
      <Helmet>
        <title>History | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <nav className="flex space-x-4 text-sm font-medium overflow-x-auto">
              {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className={`${item === 'History' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1 whitespace-nowrap`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="md:flex md:gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">Older</h2>
            
            <div className="space-y-6">
              {transactions.map((transaction, index) => (
                <div key={index} className="flex justify-between items-start py-2 border-b border-border">
                  <div>
                    <div className="font-medium mb-1">{transaction.type}</div>
                    <div className="text-sm text-muted-foreground">{transaction.details}</div>
                    {transaction.source && (
                      <div className="text-sm text-muted-foreground">{transaction.source}</div>
                    )}
                    {transaction.value && (
                      <div className="text-sm text-muted-foreground">{transaction.value}</div>
                    )}
                  </div>
                  <div className="font-medium text-right">
                    {transaction.amount && (
                      <div className={transaction.amount.startsWith('+') ? 'text-green-500' : ''}>
                        {transaction.amount}
                      </div>
                    )}
                    {transaction.estimatedValue && (
                      <div className="text-sm text-muted-foreground">{transaction.estimatedValue}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-64 lg:w-80 shrink-0 mt-8 md:mt-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Refine Results</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">Account</label>
                    <Select value={account} onValueChange={setAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="roth-ira">Roth IRA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Type</label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="deposit">Deposit</SelectItem>
                        <SelectItem value="withdrawal">Withdrawal</SelectItem>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                        <SelectItem value="dividend">Dividend</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full">Search</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AccountLayout>
    </>
  );
};

export default History;
