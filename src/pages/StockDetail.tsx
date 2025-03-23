
import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import StockDetailContent from '@/components/stocks/StockDetailContent';
import StockDetailSidebar from '@/components/stocks/StockDetailSidebar';
import { useStockDetail } from '@/hooks/useStockDetail';
import { TimeRange } from '@/components/ui/StockChart';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { 
    stockData,
    mockStockData,
    mockChartData,
    mockRecommendation,
    statsData,
    timeframe,
    setTimeframe
  } = useStockDetail(symbol);
  
  return (
    <>
      <Helmet>
        <title>{symbol ? `${symbol} Stock | StockPilot` : 'Stock Details | StockPilot'}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <StockDetailContent 
              symbol={symbol || ''}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              mockChartData={mockChartData}
              stockData={stockData}
              mockStockData={mockStockData}
            />
          </div>
          
          <div>
            <StockDetailSidebar
              symbol={stockData?.symbol || mockStockData.symbol}
              companyName={stockData?.name || mockStockData.name}
              recommendation={mockRecommendation}
              statsData={statsData}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StockDetail;
