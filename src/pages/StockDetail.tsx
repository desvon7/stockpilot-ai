
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import StockDetailContent from '@/components/stocks/StockDetailContent';
import StockDetailSidebar from '@/components/stocks/StockDetailSidebar';
import { useStockDetail } from '@/hooks/useStockDetail';
import { useRealTimeMarketData } from '@/hooks/useRealTimeMarketData';
import { TimeRange } from '@/components/ui/StockChart';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import NewsErrorState from '@/components/news/states/NewsErrorState';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [currentSymbol, setCurrentSymbol] = useState<string>(symbol || '');
  
  useEffect(() => {
    if (symbol) {
      setCurrentSymbol(symbol);
    }
  }, [symbol]);
  
  const { 
    stockData,
    mockStockData,
    mockChartData,
    mockRecommendation,
    statsData,
    timeframe,
    setTimeframe,
    isLoading: detailsLoading,
    error: stockDetailError
  } = useStockDetail(currentSymbol);

  // Subscribe to real-time updates for this stock
  const {
    quotes,
    trades,
    wsStatus,
    error: rtError,
    refresh: refreshMarketData
  } = useRealTimeMarketData({
    symbols: [currentSymbol],
    enabled: !!currentSymbol,
    onQuoteUpdate: (symbol, quote) => {
      console.log(`Real-time quote update for ${symbol}:`, quote);
    }
  });

  // Get the real-time quote
  const realTimeQuote = quotes[currentSymbol];
  
  // Show error if real-time connection failed
  useEffect(() => {
    if (rtError) {
      toast.error("Failed to connect to real-time market data", {
        description: "Using delayed data instead",
        duration: 5000,
      });
    }
  }, [rtError]);

  // Handle invalid stock symbols
  useEffect(() => {
    if (stockDetailError) {
      toast.error(`Error loading stock data for ${currentSymbol}`, {
        description: "The stock symbol may be invalid or there was a connection issue",
        duration: 5000,
      });
    }
  }, [stockDetailError, currentSymbol]);

  // Show loading screen if we're still loading essential data
  if (detailsLoading && !stockData && !mockStockData) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 flex items-center justify-center h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  // Handle error state
  if (stockDetailError && !stockData && !mockStockData) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 flex flex-col items-center justify-center h-[60vh]">
        <NewsErrorState 
          refetch={() => navigate('/stocks')} 
          errorMessage={`Unable to load stock data for ${currentSymbol}. The symbol may be invalid or there was a server error.`}
          className="max-w-2xl mx-auto"
        />
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{currentSymbol ? `${currentSymbol} Stock | StockPilot` : 'Stock Details | StockPilot'}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <StockDetailContent 
              symbol={currentSymbol}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              mockChartData={mockChartData}
              stockData={stockData}
              mockStockData={mockStockData}
              realTimeQuote={realTimeQuote}
              wsStatus={wsStatus}
            />
          </div>
          
          <div>
            <StockDetailSidebar
              symbol={stockData?.symbol || mockStockData.symbol}
              companyName={stockData?.name || mockStockData.name}
              recommendation={mockRecommendation}
              statsData={statsData}
              realTimeQuote={realTimeQuote}
              refreshData={refreshMarketData}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StockDetail;
