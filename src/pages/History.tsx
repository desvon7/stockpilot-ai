
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const History: React.FC = () => {
  // Mock transactions history
  const transactions = [
    {
      type: 'Deposit to individual',
      account: 'Individual',
      source: 'Wells Fargo Everyday Checking',
      date: 'Jan 31',
      amount: 400.00
    },
    {
      type: 'XLM sent',
      date: 'Jan 25',
      amount: -923.48,
      value: 398.25
    },
    {
      type: 'XLM Market Buy',
      date: 'Jan 25',
      amount: 923.48,
      price: 0.434212,
      value: 400.99
    },
    {
      type: 'XLM sent',
      date: 'Jan 23',
      amount: -346.81,
      value: 149.38
    },
    {
      type: 'XLM Market Buy',
      date: 'Jan 23',
      amount: 346.81,
      price: 0.432555,
      value: 150.02
    },
    {
      type: 'Invesco Solar ETF Market Sell',
      account: 'Individual',
      date: 'Jan 23',
      shares: 4.753546,
      price: 32.55,
      value: 154.73
    },
    {
      type: 'Deposit to individual',
      account: 'Individual',
      source: 'Wells Fargo Everyday Checking',
      date: 'Jan 22',
      amount: 100.00
    },
    {
      type: 'Deposit to individual',
      account: 'Individual',
      source: 'Wells Fargo Everyday Checking',
      date: 'Jan 27',
      amount: 150.00
    },
    {
      type: 'PEPE Market Buy',
      date: 'Jan 21',
      amount: 6473553.00,
      price: 0.0000161,
      value: 103.00
    },
    {
      type: 'XLM sent',
      date: 'Jan 18',
      amount: -312.95,
      value: 149.02
    },
    {
      type: 'XLM Market Buy',
      date: 'Jan 18',
      amount: 312.95,
      price: 0.479247,
      value: 149.99
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
            <nav className="flex space-x-4 text-sm font-medium">
              {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className={`${item === 'History' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-semibold">Older</h1>
          
          <Card className="p-4">
            <h2 className="text-lg font-medium mb-4">Refine Results</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Account</label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm mb-2">Type</label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="deposits">Deposits</SelectItem>
                    <SelectItem value="dividends">Dividends</SelectItem>
                    <SelectItem value="market-buys">Market Buys</SelectItem>
                    <SelectItem value="market-sells">Market Sells</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full bg-green-500 hover:bg-green-600">Search</Button>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          {transactions.map((transaction, index) => {
            let rightSide;
            
            if (transaction.type.includes('Deposit')) {
              rightSide = (
                <div className="text-green-500 font-medium">+${transaction.amount.toFixed(2)}</div>
              );
            } else if (transaction.type.includes('sent')) {
              rightSide = (
                <div>
                  <div className="font-medium">{transaction.amount} XLM</div>
                  <div className="text-sm text-muted-foreground">est. ${transaction.value.toFixed(2)}</div>
                </div>
              );
            } else if (transaction.type.includes('Market Buy') && transaction.type.includes('XLM')) {
              rightSide = (
                <div className="text-right">
                  <div className="font-medium">${transaction.value.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">{transaction.amount} Stellar Lumens at ${transaction.price}</div>
                </div>
              );
            } else if (transaction.type.includes('Market Buy') && transaction.type.includes('PEPE')) {
              rightSide = (
                <div className="text-right">
                  <div className="font-medium">${transaction.value.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">{transaction.amount.toLocaleString()} Pepe at ${transaction.price}</div>
                </div>
              );
            } else if (transaction.type.includes('Market Sell')) {
              rightSide = (
                <div className="text-right">
                  <div className="font-medium">${transaction.value.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">{transaction.shares} shares at ${transaction.price}</div>
                </div>
              );
            }
            
            return (
              <div key={index} className="flex justify-between py-4 border-b border-border">
                <div>
                  <div className="font-medium">{transaction.type}</div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.account && `${transaction.account} • `}{transaction.date}
                  </div>
                </div>
                {rightSide}
              </div>
            );
          })}
        </div>
      </AccountLayout>
    </>
  );
};

export default History;
