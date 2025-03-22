
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { ChevronRight, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const ReportsAndStatements: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Reports and Statements | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <nav className="flex space-x-4 text-sm font-medium">
              {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className={`${item === 'Reports and statements' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div>
              <h2 className="text-green-500 font-medium mb-4">Reports</h2>
              <div className="space-y-4">
                <div className="py-2 border-b border-border">Monthly statements</div>
                <div className="py-2 font-medium">Individual</div>
                <div className="py-2">Futures & event contracts</div>
                <div className="py-2">Retirement</div>
                <div className="py-2">Crypto</div>
                <div className="py-2">Spending</div>
                <div className="py-2">Tax</div>
              </div>
            </div>
            
            <div>
              <h2 className="text-muted-foreground font-medium mb-4">Daily statements</h2>
              <div className="space-y-4">
                <div className="py-2">Futures & event contracts</div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Your reports</h2>
              <p className="text-muted-foreground">Check back here after you generate your first account activity report.</p>
            </div>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-6">Customize your report</h3>
              
              <div className="mb-4">
                <label className="block text-sm mb-2">Account</label>
                <Select defaultValue="individual">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Individual" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="roth-ira">Roth IRA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm mb-2">Start date</label>
                <div className="relative">
                  <Input type="text" value="Jan 1, 2025" readOnly />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm mb-2">End date</label>
                <div className="relative">
                  <Input type="text" value="Mar 22, 2025" readOnly />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              <Button className="w-full">Generate report</Button>
            </Card>
          </div>
        </div>
      </AccountLayout>
    </>
  );
};

export default ReportsAndStatements;
