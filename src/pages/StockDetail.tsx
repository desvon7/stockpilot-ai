
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { ArrowDownIcon, ArrowUpIcon, BookmarkIcon, DollarSign, LineChart, BarChart3, Calendar, Timer, Clock, FileText, ChevronRight } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import StockChart from '@/components/ui/StockChart';
import { useQuery } from '@tanstack/react-query';
import { fetchStockDetails } from '@/services/stockService';
import AddToWatchlist from '@/components/watchlists/AddToWatchlist';
import AIRecommendationCard from '@/components/ai/AIRecommendationCard';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'>('1M');
  
  const { data: stockData, isLoading } = useQuery({
    queryKey: ['stock-details', symbol],
    queryFn: () => fetchStockDetails(symbol || ''),
    enabled: !!symbol
  });
  
  // Mock data since the API might not be connected
  const mockStockData = {
    symbol: symbol || 'AAPL',
    name: symbol === 'AAPL' ? 'Apple Inc.' : 
           symbol === 'MSFT' ? 'Microsoft Corporation' : 
           symbol === 'GOOGL' ? 'Alphabet Inc.' : 
           symbol === 'TSLA' ? 'Tesla, Inc.' : 
           symbol === 'NVDA' ? 'NVIDIA Corporation' : 'Stock Company',
    price: 187.68,
    change: 1.84,
    changePercent: 0.99,
    open: 186.12,
    previousClose: 185.84,
    dayHigh: 188.91,
    dayLow: 185.83,
    volume: 54876321,
    avgVolume: 58452136,
    marketCap: 2914736000000,
    peRatio: 32.11,
    dividend: 0.24,
    dividendYield: 0.51,
    eps: 5.84,
    beta: 1.28,
    yearHigh: 194.48,
    yearLow: 124.17,
    sector: 'Technology',
    industry: 'Consumer Electronics',
  };
  
  const mockChartData = Array.from({ length: 100 }, (_, i) => ({
    date: new Date(Date.now() - (100 - i) * 86400000).toISOString().split('T')[0],
    value: mockStockData.price - 10 + Math.random() * 20
  }));
  
  const mockNews = [
    {
      id: '1',
      title: `${mockStockData.name} Reports Strong Q3 Earnings`,
      summary: `${mockStockData.name} exceeded analyst expectations with impressive revenue growth and strong margins.`,
      source: 'Market Watch',
      date: '2023-06-09',
      url: '#',
    },
    {
      id: '2',
      title: `New Product Launch Boosts ${mockStockData.symbol} Outlook`,
      summary: 'Analysts raise price targets following successful product launch event.',
      source: 'Bloomberg',
      date: '2023-06-08',
      url: '#',
    },
    {
      id: '3',
      title: `${mockStockData.sector} Sector Showing Growth Despite Market Headwinds`,
      summary: `${mockStockData.name} and peers demonstrate resilience in challenging economic environment.`,
      source: 'Financial Times',
      date: '2023-06-07',
      url: '#',
    },
  ];
  
  const mockRecommendation = {
    symbol: mockStockData.symbol,
    name: mockStockData.name,
    recommendation: 'buy',
    confidence: 0.87,
    priceTarget: mockStockData.price * 1.15,
    currentPrice: mockStockData.price,
    reasoning: `${mockStockData.name} shows strong fundamentals with consistent revenue growth and expanding margins. The company's strategic investments in AI and new product lines position it well for future growth.`
  };
  
  const handleAddToWatchlist = () => {
    toast({
      title: "Added to Watchlist",
      description: `${symbol} has been added to your watchlist`,
    });
  };
  
  const handleBuyStock = () => {
    toast({
      title: "Order Placed",
      description: `Your order to buy ${symbol} has been placed`,
    });
  };
  
  return (
    <>
      <Helmet>
        <title>{symbol ? `${symbol} Stock | StockPilot` : 'Stock Details | StockPilot'}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{mockStockData.symbol}</h1>
                  <Badge variant="outline" className="text-xs">
                    {mockStockData.sector}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">{mockStockData.name}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatCurrency(mockStockData.price)}</div>
                <div className={`flex items-center justify-end ${mockStockData.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {mockStockData.change > 0 ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  <span>{formatCurrency(Math.abs(mockStockData.change))}</span>
                  <span className="ml-1">({formatPercent(Math.abs(mockStockData.changePercent / 100))})</span>
                </div>
              </div>
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant={timeframe === '1D' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeframe('1D')}
                    >
                      1D
                    </Button>
                    <Button
                      variant={timeframe === '1W' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeframe('1W')}
                    >
                      1W
                    </Button>
                    <Button
                      variant={timeframe === '1M' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeframe('1M')}
                    >
                      1M
                    </Button>
                    <Button
                      variant={timeframe === '3M' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeframe('3M')}
                    >
                      3M
                    </Button>
                    <Button
                      variant={timeframe === '1Y' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeframe('1Y')}
                    >
                      1Y
                    </Button>
                    <Button
                      variant={timeframe === '5Y' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeframe('5Y')}
                    >
                      5Y
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <LineChart className="h-4 w-4 mr-2" />
                      Line
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Candle
                    </Button>
                  </div>
                </div>
                <div className="h-64 md:h-80">
                  <StockChart data={mockChartData} timeframe={timeframe} />
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="overview" className="mb-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Overview</CardTitle>
                    <CardDescription>Key metrics and information about {mockStockData.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Market Cap</p>
                        <p className="font-medium">{formatCurrency(mockStockData.marketCap, true)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">P/E Ratio</p>
                        <p className="font-medium">{mockStockData.peRatio}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">EPS</p>
                        <p className="font-medium">{formatCurrency(mockStockData.eps)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Dividend Yield</p>
                        <p className="font-medium">{formatPercent(mockStockData.dividendYield / 100)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Beta</p>
                        <p className="font-medium">{mockStockData.beta}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">52w High</p>
                        <p className="font-medium">{formatCurrency(mockStockData.yearHigh)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">52w Low</p>
                        <p className="font-medium">{formatCurrency(mockStockData.yearLow)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Volume</p>
                        <p className="font-medium">{mockStockData.volume.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="font-medium mb-2">About {mockStockData.name}</h3>
                      <p className="text-muted-foreground">
                        {mockStockData.name} is a leading company in the {mockStockData.industry} industry, 
                        part of the broader {mockStockData.sector} sector. The company is known for its 
                        innovative products and services, with a strong focus on research and development.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="financials" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                    <CardDescription>Key financial metrics and reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-muted-foreground">
                        Financial data will be loaded when this tab is selected
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="news" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Latest News</CardTitle>
                    <CardDescription>Recent news and announcements about {mockStockData.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockNews.map((news) => (
                        <div key={news.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium">{news.title}</h3>
                            <Badge variant="outline" className="ml-2 whitespace-nowrap">
                              {news.source}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{news.summary}</p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{news.date}</span>
                            </div>
                            <a 
                              href={news.url} 
                              className="text-primary hover:underline flex items-center"
                            >
                              Read more <ChevronRight className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analysis" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analyst Ratings</CardTitle>
                    <CardDescription>Wall Street analyst ratings and price targets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-muted-foreground">
                        Analyst data will be loaded when this tab is selected
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Trade</CardTitle>
                <CardDescription>Buy or sell {mockStockData.symbol} shares</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    className="w-full"
                    onClick={handleBuyStock}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Buy {mockStockData.symbol}
                  </Button>
                  <AddToWatchlist stockSymbol={mockStockData.symbol} />
                </div>
              </CardContent>
            </Card>
            
            <AIRecommendationCard 
              recommendation={mockRecommendation}
              className="mb-6"
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Today's Stats</CardTitle>
                <CardDescription>Key metrics for today's trading</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Open</span>
                    <span className="font-medium">{formatCurrency(mockStockData.open)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Previous Close</span>
                    <span className="font-medium">{formatCurrency(mockStockData.previousClose)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Day High</span>
                    <span className="font-medium">{formatCurrency(mockStockData.dayHigh)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Day Low</span>
                    <span className="font-medium">{formatCurrency(mockStockData.dayLow)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Volume</span>
                    <span className="font-medium">{mockStockData.volume.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg. Volume</span>
                    <span className="font-medium">{mockStockData.avgVolume.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockDetail;
