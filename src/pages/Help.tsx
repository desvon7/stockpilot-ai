
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, ChevronRight, ExternalLink, MessageSquare } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Help | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <nav className="flex space-x-4 text-sm font-medium">
              {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className={`${item === 'Help' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
        
        <Card className="mb-8 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <Info className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="mb-1">Consolidated 1099 Forms (PDF & CSV) are available! Visit the Tax Center to check on the status of your tax forms, to download your forms, or to learn more about your tax documents.</p>
                <Button variant="link" className="p-0 h-auto text-primary">Tax Center</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <h1 className="text-2xl font-bold mb-6">Support tools</h1>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
                <Info className="h-5 w-5" />
              </div>
              <span className="font-medium">Help center</span>
            </div>
            <ExternalLink className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
                <MessageSquare className="h-5 w-5" />
              </div>
              <span className="font-medium">Your support chats</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
                <Info className="h-5 w-5" />
              </div>
              <span className="font-medium">Disclosures</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        
        <div className="mt-12">
          <p className="text-muted-foreground text-sm">Version 2025.12.3307+13744424b22d in canary</p>
          
          <Button variant="outline" className="mt-4">Contact Support</Button>
        </div>
      </AccountLayout>
    </>
  );
};

export default Help;
