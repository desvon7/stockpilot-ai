
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, Check } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const userMeta = user?.user_metadata || {};

  return (
    <>
      <Helmet>
        <title>Settings | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <nav className="flex space-x-4 text-sm font-medium overflow-x-auto">
              {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className={`${item === 'Settings' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1 whitespace-nowrap`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="space-y-1">
              <h3 className="text-lg font-medium mb-4">Account details and options</h3>
              
              <nav className="flex flex-col space-y-1">
                <a href="#personal" className="text-primary font-medium p-2 rounded hover:bg-muted/50">Personal information</a>
                <a href="#security" className="text-muted-foreground p-2 rounded hover:bg-muted/50">Security and privacy</a>
                <a href="#investing" className="text-muted-foreground p-2 rounded hover:bg-muted/50">Investing</a>
                <a href="#beneficiaries" className="text-muted-foreground p-2 rounded hover:bg-muted/50">Beneficiaries</a>
              </nav>
              
              <Separator className="my-4" />
              
              <h3 className="text-lg font-medium mb-4">App preferences</h3>
              
              <nav className="flex flex-col space-y-1">
                <a href="#appearance" className="text-muted-foreground p-2 rounded hover:bg-muted/50">App appearance</a>
              </nav>
              
              <Separator className="my-4" />
              
              <div className="space-y-4 mt-8">
                <Button variant="ghost" className="w-full text-left justify-start">Log out</Button>
                <Button variant="ghost" className="w-full text-left justify-start text-destructive">Deactivate your account</Button>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <div id="personal">
              <h2 className="text-2xl font-bold mb-6">Personal information</h2>
              
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Contact information</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2 pb-4 border-b">
                      <div className="flex justify-between">
                        <Label>Name</Label>
                      </div>
                      <div className="font-medium">{userMeta.full_name || 'Javon Jones'}</div>
                    </div>
                    
                    <div className="space-y-2 pb-4 border-b">
                      <div className="flex justify-between">
                        <Label>Email Address</Label>
                        <span className="text-green-500 font-medium flex items-center">
                          <Check className="w-4 h-4 mr-1" /> Verified
                        </span>
                      </div>
                      <div className="font-medium">{user?.email || 'javonvaljon@gmail.com'}</div>
                    </div>
                    
                    <div className="space-y-2 pb-4 border-b">
                      <div className="flex justify-between">
                        <Label>Phone Number</Label>
                        <span className="text-green-500 font-medium flex items-center">
                          <Check className="w-4 h-4 mr-1" /> Verified
                        </span>
                      </div>
                      <div className="font-medium">+1 (404) 625-4610</div>
                    </div>
                    
                    <div className="space-y-2 pb-4 border-b">
                      <div className="flex justify-between">
                        <Label>Address</Label>
                      </div>
                      <div className="font-medium">495 Breakwater Terrace, Stone Mountain, GA, 30087</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Other details</h3>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b">
                      <div>
                        <Label className="block mb-1">Account numbers</Label>
                      </div>
                      <Button variant="link" className="text-primary">See account numbers</Button>
                    </div>
                    
                    <div className="flex justify-between items-center pb-4 border-b">
                      <div>
                        <Label className="block mb-1">Investor profile</Label>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    
                    <div className="flex justify-between items-center pb-4 border-b">
                      <div>
                        <Label className="block mb-1">Trusted Contact</Label>
                        <span className="text-sm text-muted-foreground">None listed</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AccountLayout>
    </>
  );
};

export default Settings;
