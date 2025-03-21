
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Portfolio from '@/components/dashboard/Portfolio';
import StockOverview from '@/components/dashboard/StockOverview';
import Recommendations from '@/components/dashboard/Recommendations';
import { useAuth } from '@/contexts/AuthContext';
import AccountSidebar from '@/components/layout/AccountSidebar';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow flex mt-16">
        <AccountSidebar />
        <main className="flex-grow p-6">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Portfolio onStockSelect={setSelectedStock} />
                {selectedStock && <StockOverview symbol={selectedStock} />}
              </div>
              
              <div className="space-y-6">
                <Recommendations />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
