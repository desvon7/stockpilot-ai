
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { fetchTrendingStocks } from '@/services/stockService';
import { ArrowDownIcon, ArrowUpIcon, TrendingUp, Home, Search, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GlobalAssetSearch from '@/components/search/GlobalAssetSearch';

const StockBrowser: React.FC = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const navigate = useNavigate();
  
  const { data: trendingStocks, isLoading } = useQuery({
    queryKey: ['trending-stocks'],
    queryFn: fetchTrendingStocks
  });

  const mockTrendingStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 187.68, change: 1.84, changePercent: 0.99 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 412.66, change: 2.41, changePercent: 0.59 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 152.16, change: -0.74, changePercent: -0.48 },
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: 174.88, change: -3.92, changePercent: -2.19 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 893.45, change: 11.23, changePercent: 1.27 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 186.23, change: 0.92, changePercent: 0.50 },
  ];

  const popularEtfs = [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', price: 512.34, change: 1.21, changePercent: 0.24 },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: 435.67, change: 2.34, changePercent: 0.54 },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', price: 257.89, change: 0.67, changePercent: 0.26 },
    { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', price: 470.12, change: 1.05, changePercent: 0.22 },
    { symbol: 'IWM', name: 'iShares Russell 2000 ETF', price: 201.45, change: -0.87, changePercent: -0.43 },
    { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', price: 49.32, change: 0.21, changePercent: 0.43 },
  ];

  return (
    <>
      <Helmet>
        <title>Browse Stocks | StockPilot</title>
      </Helmet>
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Button 
              variant="outline" 
              size="sm"
              className="mb-4"
              onClick={() => navigate('/home')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold mb-2">Browse Stocks</h1>
            <p className="text-muted-foreground">Search and discover investment opportunities</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/home')}
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/watchlists')}
            >
              Watchlists
            </Button>
          </div>
        </div>
        
        <div className="mb-8 max-w-2xl">
          <GlobalAssetSearch />
        </div>
        
        <Tabs defaultValue="trending" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="etfs">ETFs</TabsTrigger>
            <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
            <TabsTrigger value="losers">Top Losers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Stocks
                </CardTitle>
                <CardDescription>
                  The most actively traded stocks in the market
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left font-medium">Symbol</th>
                        <th className="px-4 py-3 text-left font-medium">Name</th>
                        <th className="px-4 py-3 text-right font-medium">Price</th>
                        <th className="px-4 py-3 text-right font-medium">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTrendingStocks.map((stock) => (
                        <tr key={stock.symbol} className="border-b">
                          <td className="px-4 py-4">
                            <Link to={`/stocks/${stock.symbol}`} className="font-medium hover:text-primary">
                              {stock.symbol}
                            </Link>
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">{stock.name}</td>
                          <td className="px-4 py-4 text-right font-medium">
                            {formatCurrency(stock.price)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end">
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "font-medium",
                                  stock.change > 0 ? "text-green-500 border-green-200 bg-green-50 dark:bg-green-950/20" : 
                                  "text-red-500 border-red-200 bg-red-50 dark:bg-red-950/20"
                                )}
                              >
                                <span className="mr-1">
                                  {stock.change > 0 ? (
                                    <ArrowUpIcon className="h-3 w-3" />
                                  ) : (
                                    <ArrowDownIcon className="h-3 w-3" />
                                  )}
                                </span>
                                {formatPercent(Math.abs(stock.changePercent / 100))}
                              </Badge>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="etfs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Popular ETFs
                </CardTitle>
                <CardDescription>
                  Exchange-traded funds tracking various market indices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left font-medium">Symbol</th>
                        <th className="px-4 py-3 text-left font-medium">Name</th>
                        <th className="px-4 py-3 text-right font-medium">Price</th>
                        <th className="px-4 py-3 text-right font-medium">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {popularEtfs.map((etf) => (
                        <tr key={etf.symbol} className="border-b">
                          <td className="px-4 py-4">
                            <Link to={`/stocks/${etf.symbol}`} className="font-medium hover:text-primary flex items-center gap-1">
                              {etf.symbol}
                              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">ETF</Badge>
                            </Link>
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">{etf.name}</td>
                          <td className="px-4 py-4 text-right font-medium">
                            {formatCurrency(etf.price)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end">
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "font-medium",
                                  etf.change > 0 ? "text-green-500 border-green-200 bg-green-50 dark:bg-green-950/20" : 
                                  "text-red-500 border-red-200 bg-red-50 dark:bg-red-950/20"
                                )}
                              >
                                <span className="mr-1">
                                  {etf.change > 0 ? (
                                    <ArrowUpIcon className="h-3 w-3" />
                                  ) : (
                                    <ArrowDownIcon className="h-3 w-3" />
                                  )}
                                </span>
                                {formatPercent(Math.abs(etf.changePercent / 100))}
                              </Badge>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gainers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpIcon className="h-5 w-5 text-green-500" />
                  Top Gainers
                </CardTitle>
                <CardDescription>
                  Stocks with the highest percentage gains today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">
                    Data will be loaded when this tab is selected
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="losers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownIcon className="h-5 w-5 text-red-500" />
                  Top Losers
                </CardTitle>
                <CardDescription>
                  Stocks with the highest percentage losses today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">
                    Data will be loaded when this tab is selected
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default StockBrowser;
