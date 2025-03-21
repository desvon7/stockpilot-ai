
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StockOverview from '@/components/dashboard/StockOverview';
import Portfolio from '@/components/dashboard/Portfolio';
import PortfolioPerformance from '@/components/dashboard/PortfolioPerformance';
import PortfolioSectors from '@/components/dashboard/PortfolioSectors';
import Recommendations from '@/components/dashboard/Recommendations';
import { stockData, recommendationData, marketIndices } from '@/utils/mockData';
import { formatCurrency, formatPercent, getColorByChange, getArrowByChange } from '@/utils/formatters';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your financial overview for today.
            </p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Market Indices</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketIndices.map((index) => (
                <div key={index.id} className="glass-card rounded-lg p-5">
                  <p className="text-muted-foreground mb-1">{index.name}</p>
                  <p className="text-2xl font-semibold">{formatCurrency(index.value)}</p>
                  <p className={getColorByChange(index.change)}>
                    {getArrowByChange(index.change)} {formatCurrency(index.change)} ({formatPercent(index.changePercent)})
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Portfolio Performance Chart */}
          <div className="mb-8">
            <PortfolioPerformance />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Portfolio className="mb-8" />
              <StockOverview stocks={stockData} />
            </div>
            
            <div className="space-y-8">
              <PortfolioSectors />
              <Recommendations recommendations={recommendationData} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
