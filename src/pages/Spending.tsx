
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ChevronRight } from 'lucide-react';

const Spending: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Spending | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <nav className="flex space-x-4 text-sm font-medium">
              {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className={`${item === 'Spending' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Money Settings</h1>
          <h2 className="text-xl font-semibold mb-6">Settings</h2>
        </div>
        
        <div className="space-y-6">
          <div className="border-b border-border pb-4">
            <div className="flex justify-between items-center py-3">
              <div>Account and routing numbers</div>
              <button className="text-primary">Show</button>
            </div>
          </div>
          
          <div className="border-b border-border pb-4">
            <h3 className="font-semibold mb-4">Debit Card</h3>
            
            <div className="flex justify-between items-center py-3">
              <div>Lock card</div>
              <Switch />
            </div>
            
            <div className="flex justify-between items-center py-3">
              <div>Change Pin</div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          
          <div className="border-b border-border pb-4">
            <h3 className="font-semibold mb-4">Paycheck & Direct Deposit</h3>
            
            <div className="flex justify-between items-center py-3">
              <div>Set up new direct deposit</div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="flex justify-between items-center py-3">
              <div>
                <div>Early direct deposit</div>
                <div className="text-sm text-muted-foreground">Get paid up to 2 days before payday—for free.</div>
              </div>
              <Switch />
            </div>
          </div>
          
          <div className="border-b border-border pb-4">
            <h3 className="font-semibold mb-4">Round-up</h3>
            
            <div className="flex justify-between items-center py-3">
              <div>Set up Round-up</div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          
          <div className="border-b border-border pb-4">
            <h3 className="font-semibold mb-4">Support</h3>
            
            <div className="flex justify-between items-center py-3">
              <div>I have a problem</div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </AccountLayout>
    </>
  );
};

export default Spending;
