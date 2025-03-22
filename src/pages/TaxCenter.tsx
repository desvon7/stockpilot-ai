
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { ChevronRight, Check, Clock, AlertCircle, Calendar, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TaxCenterContent = () => {
  return (
    <>
      <div className="border-b border-border pb-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <nav className="flex space-x-4 text-sm font-medium">
            {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
              <a 
                key={item} 
                href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}  
                className={`${item === 'Tax center' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1`}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold mr-2">Tax documents</h1>
          <button>
            <Info className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        
        <div>
          <Select defaultValue="2024">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="2024" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center py-4 border-b border-border">
            <div>
              <div className="font-medium">Robinhood Markets Consolidated Transactions</div>
              <div className="text-sm text-muted-foreground">Issued on February 10, 2025</div>
            </div>
            <Button variant="link">Download CSV</Button>
          </div>
          
          <div className="flex justify-between items-center py-4 border-b border-border">
            <div>
              <div className="font-medium">Robinhood Markets Consolidated Form 1099</div>
              <div className="text-sm text-muted-foreground">Issued on February 5, 2025</div>
            </div>
            <Button variant="link">Download PDF</Button>
          </div>
        </div>
        
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              Timeline
              <button>
                <Info className="h-4 w-4 text-muted-foreground" />
              </button>
            </h2>
            
            <div className="relative pl-8 border-l-2 border-green-500 space-y-6">
              <div className="relative">
                <div className="absolute -left-[1.85rem] top-0">
                  <div className="rounded-full bg-green-500 p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <div className="font-medium">January 31, 2025</div>
                  <div className="text-sm text-muted-foreground">You don't have a Form 1099-R this year</div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-[1.85rem] top-0">
                  <div className="rounded-full bg-green-500 p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <div className="font-medium">February 5, 2025</div>
                  <div className="text-sm text-muted-foreground">Consolidated 1099s released</div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-[1.85rem] top-0">
                  <div className="rounded-full bg-gray-300 dark:bg-gray-700 p-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <div className="font-medium">April 15, 2025</div>
                  <div className="text-sm text-muted-foreground">IRS tax filing deadline</div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-[1.85rem] top-0">
                  <div className="rounded-full bg-gray-300 dark:bg-gray-700 p-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <div className="font-medium">May 31, 2025</div>
                  <div className="text-sm text-muted-foreground">Form 5498 for IRA released</div>
                </div>
              </div>
            </div>
          </div>
          
          <Card className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium mb-2">You can still make 2024 contributions to your IRA, up to your annual limit, by April 15.</p>
                  <Button variant="link" className="px-0 text-green-500 h-auto py-0">Contribute</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

const TaxCenter: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Tax Center | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <TaxCenterContent />
      </AccountLayout>
    </>
  );
};

export default TaxCenter;
