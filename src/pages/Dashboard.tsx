
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import Portfolio from '@/components/dashboard/Portfolio';
import PortfolioPerformance from '@/components/dashboard/PortfolioPerformance';
import PortfolioSectors from '@/components/dashboard/PortfolioSectors';
import Recommendations from '@/components/dashboard/Recommendations';
import StockOverview from '@/components/dashboard/StockOverview';
import LiveMarketData from '@/components/market/LiveMarketData';
import DashboardSettings from '@/components/dashboard/DashboardSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, BarChart3, PieChart, Settings, Search } from 'lucide-react';
import { mockStocks, mockRecommendations } from '@/utils/mockData';
import { usePortfolio } from '@/hooks/usePortfolio';
import { usePortfolioHistory } from '@/hooks/usePortfolioHistory';
import { usePortfolioSectors } from '@/hooks/usePortfolioSectors';
import StockSearch from '@/components/ui/StockSearch';
import { Input } from '@/components/ui/input';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('portfolio');
  const { portfolio, isLoading: portfolioLoading } = usePortfolio();
  const { history, isLoading: historyLoading } = usePortfolioHistory();
  const { sectors, isLoading: sectorsLoading } = usePortfolioSectors();
  const [showSearch, setShowSearch] = useState(false);

  const welcomeMessage = `Welcome, ${user?.user_metadata?.full_name || 'Investor'}`;

  return (
    <>
      <Helmet>
        <title>Dashboard | StockPilot</title>
      </Helmet>
      
      <div className="container mx-auto px-4 pt-24 pb-16 min-h-screen">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
            <h1 className="text-3xl font-bold mr-4">{welcomeMessage}</h1>
            <button 
              onClick={() => setShowSearch(!showSearch)} 
              className="p-2 rounded-full hover:bg-muted transition-all"
              aria-label="Search stocks"
            >
              <Search size={20} />
            </button>
          </div>
          
          {showSearch && (
            <div className="w-full md:w-1/2 lg:w-1/3 mb-4">
              <StockSearch className="w-full" />
            </div>
          )}
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="portfolio" className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Portfolio</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Performance</span>
              </TabsTrigger>
              <TabsTrigger value="sectors" className="flex items-center gap-1.5">
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">Sectors</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1.5">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Left Column - Portfolio and Recommendations */}
              <div className="lg:col-span-2 space-y-6">
                <TabsContent value="portfolio" className="m-0">
                  <Portfolio 
                    portfolio={portfolio}
                    isLoading={portfolioLoading}
                  />
                </TabsContent>
                
                <TabsContent value="performance" className="m-0">
                  <PortfolioPerformance 
                    history={history}
                    isLoading={historyLoading}
                  />
                </TabsContent>
                
                <TabsContent value="sectors" className="m-0">
                  <PortfolioSectors 
                    sectors={sectors}
                    isLoading={sectorsLoading}
                  />
                </TabsContent>
                
                <TabsContent value="settings" className="m-0">
                  <DashboardSettings />
                </TabsContent>
                
                {activeTab !== 'settings' && (
                  <StockOverview 
                    stocks={mockStocks} 
                    className="lg:hidden"
                  />
                )}
              </div>
              
              {/* Right Column - Market Overview and stats */}
              <div className="space-y-6">
                <LiveMarketData />
                
                <StockOverview 
                  stocks={mockStocks} 
                  className="hidden lg:block"
                />
                
                <Recommendations 
                  recommendations={mockRecommendations} 
                />
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
