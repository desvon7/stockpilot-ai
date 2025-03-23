
import React from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import AccountLayout from '@/components/layout/AccountLayout';
import PortfolioSummary from '@/components/home/PortfolioSummary';
import BuyingPowerCard from '@/components/home/BuyingPowerCard';
import AnnouncementCard from '@/components/home/AnnouncementCard';
import CryptoCurrenciesSection from '@/components/home/CryptoCurrenciesSection';
import StocksSection from '@/components/home/StocksSection';
import WatchlistsSection from '@/components/home/WatchlistsSection';

// Define a proper interface for watchlist items
interface WatchlistItem {
  symbol: string;
  price: number;
  change: number;
  type?: string;
  date?: string;
}

interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
}

const Home: React.FC = () => {
  const { portfolio, isLoading } = usePortfolio();
  
  // Mock data for demonstration
  const portfolioSummary = {
    value: 557.55,
    change: 18.57,
    changePercent: 3.44,
    buyingPower: 4.75
  };

  // Mock chart data
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 30 + i);
    return {
      date: date.toISOString().split('T')[0],
      price: 500 + Math.random() * 100
    };
  });

  // Mock stocks data
  const stocks = [
    { symbol: 'EXOD', name: 'Exodus', shares: 10, price: 50.60, change: 4.31 },
    { symbol: 'HOOD', name: 'Robinhood', price: 33.93, change: 0.00, type: 'call', date: '1/16/2026' },
    { symbol: 'VTI', name: 'Vanguard Total Stock', price: 277.00, change: -0.62 },
    { symbol: 'VPU', name: 'Vanguard Utilities', price: 171.72, change: 0.05 },
    { symbol: 'VOO', name: 'Vanguard S&P 500', price: 516.68, change: -0.66 },
    { symbol: 'VYM', name: 'Vanguard High Dividend', price: 128.50, change: -0.34 },
    { symbol: 'VGT', name: 'Vanguard Information Tech', price: 561.00, change: -0.30 }
  ];

  // Mock crypto data
  const cryptos = [
    { symbol: 'PEPE', name: 'Pepe', price: 0.00000723, change: -4.55, holdings: 6473553.00 }
  ];

  // Mock lists with properly typed items
  const watchlists: Watchlist[] = [
    { id: '1', name: 'Options Watchlist', items: [
      { symbol: 'HOOD', price: 33.93, change: 0.00, type: 'call', date: '1/16/2026' }
    ]},
    { id: '2', name: 'My First List', items: [
      { symbol: 'VTI', price: 277.00, change: -0.62 },
      { symbol: 'VPU', price: 171.72, change: 0.05 },
      { symbol: 'VOO', price: 516.68, change: -0.66 },
      { symbol: 'VYM', price: 128.50, change: -0.34 },
      { symbol: 'VGT', price: 561.00, change: -0.30 }
    ]}
  ];

  // Announcement data
  const announcement = {
    date: 'Mar 26',
    title: 'Robinhood announcement',
    content: 'You\'re invited to a livestream with CEO Vlad Tenev on March 26 at 6:30 PM PT/9:30 PM ET.'
  };

  return (
    <AccountLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Portfolio Summary */}
        <PortfolioSummary 
          portfolioSummary={portfolioSummary} 
          chartData={chartData} 
        />
        
        {/* Buying Power */}
        <BuyingPowerCard buyingPower={portfolioSummary.buyingPower} />
        
        {/* Announcement */}
        <AnnouncementCard announcement={announcement} />
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Cryptocurrency Section */}
            <CryptoCurrenciesSection cryptos={cryptos} />
            
            {/* Stocks Section */}
            <StocksSection stocks={stocks} limit={2} />
          </div>
          
          {/* Watchlists */}
          <div>
            <WatchlistsSection watchlists={watchlists} />
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default Home;
