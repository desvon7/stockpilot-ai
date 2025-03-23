
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, ListChecks } from 'lucide-react';

const StockLending: React.FC = () => {
  const [account, setAccount] = useState('individual');

  return (
    <>
      <Helmet>
        <title>Stock Lending | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Stock Lending</h1>
            <button aria-label="Info about stock lending">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.375 9.375H10V13.75H10.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 6.875C10.3452 6.875 10.625 6.59519 10.625 6.25C10.625 5.90481 10.3452 5.625 10 5.625C9.65482 5.625 9.375 5.90481 9.375 6.25C9.375 6.59519 9.65482 6.875 10 6.875Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          
          <div className="flex items-center">
            <Select value={account} onValueChange={setAccount}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Individual" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="roth-ira">Roth IRA</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="icon" className="ml-2">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-background">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-1">$0</h2>
                <p className="text-muted-foreground">Last month</p>
              </div>
              <div className="rounded-full p-3 bg-background border">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="25" r="15" fill="#65A30D" />
                  <circle cx="25" cy="25" r="13" fill="#84CC16" />
                </svg>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-1">$0</h2>
                <p className="text-muted-foreground">Total</p>
              </div>
              <div className="rounded-full p-3 bg-background border">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="15" width="30" height="20" rx="2" fill="#65A30D" />
                  <rect x="12" y="18" width="26" height="14" rx="1" fill="#84CC16" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Stocks on loan</h2>
            <div className="text-sm text-muted-foreground">Updated around 3 PM ET every trading day</div>
          </div>
          
          <Card className="bg-background p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
            <div className="mb-4 bg-muted rounded-full p-4">
              <ListChecks className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mb-1 text-muted-foreground">You don't have any stocks on loan right now.</p>
            <p className="mb-6 text-muted-foreground">If we loan out any of your stocks, they will be listed here.</p>
          </Card>
        </div>
        
        <Button size="lg" className="font-semibold">Enable Stock Lending</Button>
      </AccountLayout>
    </>
  );
};

export default StockLending;
