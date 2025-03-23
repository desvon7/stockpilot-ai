
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { usePortfolio } from '@/hooks/usePortfolio';
import InvestingHeader from '@/components/investing/InvestingHeader';
import StocksSection from '@/components/investing/StocksSection';
import CryptoSection from '@/components/investing/CryptoSection';
import AccountFeatureCards from '@/components/investing/AccountFeatureCards';
import PortfolioBreakdown from '@/components/investing/PortfolioBreakdown';

const Investing: React.FC = () => {
  const { portfolio, isLoading } = usePortfolio();
  
  // Mock data for the portfolio breakdown
  const portfolioData = [
    { name: 'Stocks', value: 468.00, color: '#4ade80', percentage: 90.07 },
    { name: 'Cryptocurrencies', value: 46.87, color: '#f87171', percentage: 9.02 },
    { name: 'Cash', value: 4.75, color: '#60a5fa', percentage: 0.91 }
  ];

  const stockData = [
    { symbol: 'EXOD', name: 'Exodus Movement, Inc.', shares: 10, price: 46.80, cost: 35.00, totalReturn: 82.00, equity: 468.00 }
  ];

  const cryptoData = [
    { symbol: 'PEPE', name: 'Pepe', quantity: '6,473,553.00', price: 0.00000724, cost: 0.00, totalReturn: -56.13, equity: 46.87 }
  ];

  const totalPortfolioValue = portfolioData.reduce((acc, item) => acc + item.value, 0);

  return (
    <>
      <Helmet>
        <title>Investing | StockPilot</title>
      </Helmet>
      
      <AccountLayout title="">
        <InvestingHeader totalPortfolioValue={totalPortfolioValue} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <StocksSection 
              stockData={stockData} 
              percentage={portfolioData[0].percentage} 
            />
            
            <CryptoSection 
              cryptoData={cryptoData} 
              percentage={portfolioData[1].percentage} 
            />
            
            <AccountFeatureCards cashValue={portfolioData[2].value} />
          </div>
          
          <div>
            <PortfolioBreakdown 
              portfolioData={portfolioData}
              totalPortfolioValue={totalPortfolioValue}
            />
          </div>
        </div>
      </AccountLayout>
    </>
  );
};

export default Investing;
