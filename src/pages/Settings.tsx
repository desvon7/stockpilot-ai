
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Settings | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <nav className="flex space-x-4 text-sm font-medium">
              {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className={`${item === 'Settings' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-4">
            <div>
              <h2 className="text-lg mb-4">Account details and options</h2>
              <div className="space-y-2">
                <div className="py-2 text-green-500 font-medium">Personal information</div>
                <div className="py-2">Security and privacy</div>
                <div className="py-2">Investing</div>
                <div className="py-2">Beneficiaries</div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg mb-4">App preferences</h2>
              <div className="space-y-2">
                <div className="py-2">App appearance</div>
              </div>
            </div>
            
            <div className="space-y-2 pt-4">
              <div className="py-2">Log out</div>
              <div className="py-2 text-red-500">Deactivate your account</div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <h1 className="text-2xl font-bold mb-6">Personal information</h1>
            
            <div>
              <h2 className="text-lg font-medium mb-4">Contact information</h2>
              
              <div className="border-b border-border py-4">
                <div className="flex justify-between">
                  <div className="text-muted-foreground">Name</div>
                  <div>Javon Jones</div>
                </div>
              </div>
              
              <div className="border-b border-border py-4">
                <div className="flex justify-between">
                  <div className="text-muted-foreground">Email Address</div>
                  <div className="flex items-center">
                    <span className="mr-2">javonvaljon@gmail.com</span>
                    <span className="text-green-500 text-sm">Verified</span>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-border py-4">
                <div className="flex justify-between">
                  <div className="text-muted-foreground">Phone Number</div>
                  <div className="flex items-center">
                    <span className="mr-2">+1 (404) 625-4610</span>
                    <span className="text-green-500 text-sm">Verified</span>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-border py-4">
                <div className="flex justify-between">
                  <div className="text-muted-foreground">Address</div>
                  <div>495 Breakwater Terrace, Stone Mountain, GA, 30087</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Other details</h2>
              
              <div className="border-b border-border py-4">
                <div className="flex justify-between">
                  <div className="text-muted-foreground">Account numbers</div>
                  <button className="text-green-500">See account numbers</button>
                </div>
              </div>
              
              <div className="border-b border-border py-4">
                <div className="flex justify-between items-center">
                  <div className="text-muted-foreground">Investor profile</div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <div className="border-b border-border py-4">
                <div className="flex justify-between">
                  <div className="text-muted-foreground">Trusted Contact</div>
                  <div>None listed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AccountLayout>
    </>
  );
};

export default Settings;
