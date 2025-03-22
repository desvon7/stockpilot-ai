
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { ChevronRight, ArrowRight, Upload, CreditCard, RefreshCw, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Recurring: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Recurring Investments | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <nav className="flex space-x-4 text-sm font-medium">
              {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className={`${item === 'Recurring' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          
          <div className="flex mb-6">
            <Select defaultValue="all-accounts">
              <SelectTrigger className="w-[200px] mr-4">
                <SelectValue placeholder="All accounts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-accounts">All accounts</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="roth-ira">Roth IRA</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all-assets">
              <SelectTrigger className="w-[200px]">
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
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-6">Recurring Investments</h1>
          
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
              <DollarSign className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-lg mb-4 text-center">Create a recurring investment in a stock and it'll appear here!</p>
            <Button variant="default" className="bg-green-500 hover:bg-green-600">Create recurring investment</Button>
          </div>
        </div>
      </AccountLayout>
    </>
  );
};

export default Recurring;
