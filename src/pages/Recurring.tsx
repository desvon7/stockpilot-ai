
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign } from 'lucide-react';

const Recurring: React.FC = () => {
  const [accountFilter, setAccountFilter] = useState('all-accounts');
  const [assetFilter, setAssetFilter] = useState('all-assets');

  return (
    <>
      <Helmet>
        <title>Recurring Investments | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <nav className="flex space-x-4 text-sm font-medium overflow-x-auto">
              {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className={`${item === 'Recurring' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1 whitespace-nowrap`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="mb-8 flex flex-wrap gap-4">
          <Select value={accountFilter} onValueChange={setAccountFilter}>
            <SelectTrigger className="w-[160px] bg-background">
              <SelectValue placeholder="All accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-accounts">All accounts</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="roth-ira">Roth IRA</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={assetFilter} onValueChange={setAssetFilter}>
            <SelectTrigger className="w-[160px] bg-background">
              <SelectValue placeholder="All assets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-assets">All assets</SelectItem>
              <SelectItem value="stocks">Stocks</SelectItem>
              <SelectItem value="etfs">ETFs</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-10">Recurring Investments</h2>
          
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-muted rounded-full p-4 mb-6">
              <DollarSign className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-6 text-center">
              Create a recurring investment in a stock and it'll appear here!
            </p>
            <Button size="lg" className="px-6">Create recurring investment</Button>
          </div>
        </div>
      </AccountLayout>
    </>
  );
};

export default Recurring;
