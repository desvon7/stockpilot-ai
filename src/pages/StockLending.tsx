
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cog } from 'lucide-react';

const StockLending: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Stock Lending | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <nav className="flex space-x-4 text-sm font-medium overflow-x-auto">
              {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className={`${item === 'Stock Lending' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1 whitespace-nowrap`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Stock Lending</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select defaultValue="individual">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Individual" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="retirement">Retirement</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Cog className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card text-card-foreground">
            <CardContent className="pt-6 pb-8 px-6 flex items-center">
              <div className="mr-auto">
                <h2 className="text-3xl font-bold">$0</h2>
                <p className="text-sm text-muted-foreground">Last month</p>
              </div>
              <div className="w-16 h-16">
                <img src="/lovable-uploads/dc7e632e-02b8-4e89-80c1-40becdefdf24.png" alt="Coins" className="w-full h-full" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card text-card-foreground">
            <CardContent className="pt-6 pb-8 px-6 flex items-center">
              <div className="mr-auto">
                <h2 className="text-3xl font-bold">$0</h2>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div className="w-16 h-16">
                <img src="/lovable-uploads/3f1286c3-2e70-45da-9d83-d722f9864936.png" alt="Money" className="w-full h-full" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Stocks on loan</h2>
          <p className="text-sm text-muted-foreground mb-4">Updated around 3 PM ET every trading day</p>
          
          <Card className="bg-card text-card-foreground">
            <CardContent className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-4 bg-muted rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 9H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M7 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              
              <p className="text-center text-muted-foreground max-w-md">
                You don't have any stocks on loan right now. If we loan out any of your stocks, they will be listed here.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-center">
          <Button className="px-8 py-6 rounded-full bg-white text-black hover:bg-gray-100 dark:bg-primary dark:text-white dark:hover:bg-primary/90">
            Enable Stock Lending
          </Button>
        </div>
      </AccountLayout>
    </>
  );
};

export default StockLending;
