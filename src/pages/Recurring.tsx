
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Recurring: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Recurring | StockPilot</title>
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
        
        <div className="flex flex-wrap gap-4 mb-8">
          <Select defaultValue="all-accounts">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-accounts">All accounts</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="retirement">Retirement</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all-assets">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All assets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-assets">All assets</SelectItem>
              <SelectItem value="stocks">Stocks</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Recurring Investments</h2>
          
          <Card className="bg-card text-card-foreground">
            <CardContent className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-4 bg-muted rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              
              <p className="text-center text-muted-foreground mb-6">
                Create a recurring investment in a stock and it'll appear here!
              </p>
              
              <Button className="px-6 py-5 bg-green-500 hover:bg-green-600 text-white rounded-full">
                Create recurring investment
              </Button>
            </CardContent>
          </Card>
        </div>
      </AccountLayout>
    </>
  );
};

export default Recurring;
