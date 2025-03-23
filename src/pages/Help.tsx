
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Button } from '@/components/ui/button';
import { ExternalLink, MessageSquare, Info, ChevronRight } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Help Center | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <nav className="flex space-x-4 text-sm font-medium overflow-x-auto">
              {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className={`${item === 'Help' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1 whitespace-nowrap`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
          <div className="shrink-0 mt-1">
            <Info className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="mb-2">Consolidated 1099 Forms (PDF & CSV) are available! Visit the Tax Center to check on the status of your tax forms, to download your forms, or to learn more about your tax documents.</p>
            <Button variant="link" className="p-0 h-auto text-amber-600 dark:text-amber-400" asChild>
              <a href="/tax-center">Tax Center</a>
            </Button>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mb-6">Support tools</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer rounded">
            <div className="flex items-center gap-4">
              <div className="bg-muted rounded-full p-2">
                <Info className="h-5 w-5" />
              </div>
              <span>Help center</span>
            </div>
            <ExternalLink className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex justify-between items-center p-4 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer rounded">
            <div className="flex items-center gap-4">
              <div className="bg-muted rounded-full p-2">
                <MessageSquare className="h-5 w-5" />
              </div>
              <span>Your support chats</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex justify-between items-center p-4 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer rounded">
            <div className="flex items-center gap-4">
              <div className="bg-muted rounded-full p-2">
                <Info className="h-5 w-5" />
              </div>
              <span>Disclosures</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        
        <div className="mt-12 text-xs text-muted-foreground">
          <p className="mb-6">Version 2025.12.3307+13744424b22d in canary</p>
          
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Contact Support
          </Button>
        </div>
      </AccountLayout>
    </>
  );
};

export default Help;
