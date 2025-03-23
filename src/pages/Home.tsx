
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useStockNews } from '@/hooks/useStockNews';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Imported refactored components
import WelcomeHeader from '@/components/home/WelcomeHeader';
import PortfolioSummaryCard from '@/components/home/PortfolioSummaryCard';
import PortfolioAllocationCard from '@/components/home/PortfolioAllocationCard';
import UpcomingEventsCard from '@/components/home/UpcomingEventsCard';
import LatestNewsCard from '@/components/home/LatestNewsCard';
import PortfolioHoldingsTab from '@/components/home/PortfolioHoldingsTab';
import NewsTab from '@/components/home/NewsTab';
import EventsTab from '@/components/home/EventsTab';
import PortfolioAnalysisCard from '@/components/home/PortfolioAnalysisCard';

const Home: React.FC = () => {
  const { portfolio, isLoading } = usePortfolio();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get portfolio holdings symbols for news
  const portfolioSymbols = useMemo(() => {
    if (!portfolio) return ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];
    return portfolio.map(item => item.symbol);
  }, [portfolio]);
  
  // Fetch news relevant to user's portfolio
  const { news, isLoading: newsLoading } = useStockNews(
    portfolioSymbols,
    ['earnings', 'general', 'market'],
    5
  );
  
  // Mock data for demonstration
  const portfolioSummary = {
    value: 257635.50,
    change: 5824.75,
    changePercent: 2.31,
    buyingPower: 18540.25,
    totalGain: 42680.35, 
    totalGainPercent: 19.85
  };

  // Mock chart data from previous month to today
  const chartData = useMemo(() => {
    const today = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Generate a somewhat realistic portfolio growth curve
      const baseValue = 240000;
      const dayFactor = i / 30; // Normalized day factor (0 to 1)
      const trendFactor = 15000 * dayFactor; // General upward trend
      
      // Add some oscillation
      const oscillation = Math.sin(i * 0.5) * 5000;
      
      // Random daily variation
      const dailyVariation = (Math.random() - 0.5) * 2000;
      
      return {
        date: date.toISOString().split('T')[0],
        price: baseValue + trendFactor + oscillation + dailyVariation
      };
    });
  }, []);

  // Mock upcoming events
  const upcomingEvents = [
    { 
      id: 1,
      title: 'Earnings Release',
      company: 'Apple Inc. (AAPL)',
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      type: 'earnings'
    },
    { 
      id: 2,
      title: 'Dividend Payment',
      company: 'Microsoft (MSFT)',
      date: new Date(new Date().setDate(new Date().getDate() + 7)),
      type: 'dividend'
    },
    { 
      id: 3,
      title: 'Market Holiday',
      company: 'US Markets',
      date: new Date(new Date().setDate(new Date().getDate() + 14)),
      type: 'market'
    }
  ];
  
  // Mock portfolio allocation data
  const allocation = [
    { name: 'Technology', percentage: 42, color: 'bg-blue-500' },
    { name: 'Healthcare', percentage: 18, color: 'bg-green-500' },
    { name: 'Financial', percentage: 15, color: 'bg-amber-500' },
    { name: 'Consumer', percentage: 12, color: 'bg-purple-500' },
    { name: 'Others', percentage: 13, color: 'bg-gray-500' }
  ];

  return (
    <DashboardLayout title="Home">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <WelcomeHeader className="mb-6" />
        
        {/* Portfolio Summary */}
        <div className="mb-6">
          <PortfolioSummaryCard 
            portfolioSummary={portfolioSummary}
            chartData={chartData}
          />
        </div>
        
        {/* Tabs for Different Views */}
        <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="news">Latest News</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Portfolio Allocation */}
              <div className="md:col-span-2">
                <PortfolioAnalysisCard isInView={true} />
              </div>
              
              {/* Upcoming Events */}
              <div>
                <UpcomingEventsCard events={upcomingEvents} compact />
              </div>
            </div>
            
            {/* News Section */}
            <div className="mt-6">
              <LatestNewsCard 
                news={news}
                isLoading={newsLoading}
                limit={3}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="holdings">
            <PortfolioHoldingsTab portfolio={portfolio} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="news">
            <NewsTab news={news} isLoading={newsLoading} />
          </TabsContent>
          
          <TabsContent value="events">
            <EventsTab events={upcomingEvents} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Home;
