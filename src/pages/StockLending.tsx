
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { ChevronRight, Settings, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StockLendingContent = () => {
  return (
    <>
      <div className="border-b border-border pb-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <nav className="flex space-x-4 text-sm font-medium">
            {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
              <a 
                key={item} 
                href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                className={`${item === 'Stock Lending' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1`}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Stock Lending</h1>
            <button>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
              </svg>
            </button>
          </div>
          <Settings className="h-6 w-6" />
        </div>
        
        <div>
          <Select defaultValue="individual">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Individual" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="roth-ira">Roth IRA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">$0</h2>
              <p className="text-sm text-muted-foreground">Last month</p>
            </div>
            <div className="bg-green-500/20 p-4 rounded-full">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor" className="text-green-500">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="7" fill="currentColor" />
              </svg>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">$0</h2>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="bg-green-500/20 p-4 rounded-full">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor" className="text-green-500">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <path d="M12 8v8M8 12h8" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Stocks on loan</h2>
          <p className="text-sm text-muted-foreground">Updated around 3 PM ET every trading day</p>
        </div>
        
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-center max-w-md mb-2">You don't have any stocks on loan right now. If we loan out any of your stocks, they will be listed here.</p>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-center">
        <Button variant="outline" className="px-8">Enable Stock Lending</Button>
      </div>
    </>
  );
};

const StockLending: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Stock Lending | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <StockLendingContent />
      </AccountLayout>
    </>
  );
};

export default StockLending;
