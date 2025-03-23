
import React from 'react';
import { Helmet } from 'react-helmet-async';
import NavigationBar from '@/components/layout/NavigationBar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, List } from 'lucide-react';

const StockLending = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Stock Lending | StockPilot</title>
      </Helmet>
      
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Stock Lending</h1>
            <button className="ml-2 text-gray-400">
              <Settings size={20} />
            </button>
          </div>
          
          <Select defaultValue="individual">
            <SelectTrigger className="w-[180px] bg-black border-gray-800 text-white">
              <SelectValue placeholder="Individual" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800 text-white">
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="roth-ira">Roth IRA</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex items-center">
            <div className="mr-4">
              <img src="public/lovable-uploads/531adda1-2b34-4b2f-ac71-7a309b25ce02.png" alt="Coins" className="h-16 w-16" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">$0</h2>
              <p className="text-gray-400">Last month</p>
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex items-center">
            <div className="mr-4">
              <img src="public/lovable-uploads/6e4c7ac6-5532-40e5-98ca-656e82d19a69.png" alt="Money" className="h-16 w-16" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">$0</h2>
              <p className="text-gray-400">Total</p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Stocks on loan</h2>
            <p className="text-sm text-gray-400">Updated around 3 PM ET every trading day</p>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 flex flex-col items-center justify-center text-center">
            <div className="bg-gray-800 rounded-full p-6 mb-6">
              <List size={32} className="text-gray-500" />
            </div>
            <p className="text-gray-300 mb-2">You don't have any stocks on loan right now.</p>
            <p className="text-gray-400 mb-6">If we loan out any of your stocks, they will be listed here.</p>
          </div>
        </div>
        
        <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full">
          Enable Stock Lending
        </Button>
      </div>
    </div>
  );
};

export default StockLending;
