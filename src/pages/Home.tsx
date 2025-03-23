
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { formatCurrency, formatPercent, getColorByChange } from '@/utils/formatters';
import { ArrowRight, ArrowUp, ArrowDown, Wallet, BarChart3, TrendingUp, Calendar, Bell, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import StockChart from '@/components/ui/StockChart';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useStockNews } from '@/hooks/useStockNews';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PortfolioSummary from '@/components/dashboard/PortfolioSummary';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSettings from '@/components/dashboard/DashboardSettings';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { portfolio, isLoading } = usePortfolio();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get portfolio holdings symbols for news
  const portfolioSymbols = React.useMemo(() => {
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
  const chartData = React.useMemo(() => {
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-16 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.user_metadata?.full_name || 'Investor'}</h1>
              <p className="text-muted-foreground">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/portfolio')}>
                Portfolio Details
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <DashboardSettings />
            </div>
          </div>
          
          {/* Portfolio Summary */}
          <div className="mb-6">
            <Card className="bg-card shadow-lg border-none overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Value and Chart */}
                  <div className="lg:col-span-2 p-6 border-b lg:border-b-0 lg:border-r border-border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-muted-foreground">Total Portfolio Value</div>
                        <div className="text-4xl font-bold mt-1">{formatCurrency(portfolioSummary.value)}</div>
                        <div className={cn("flex items-center mt-1", portfolioSummary.change >= 0 ? "text-green-500" : "text-red-500")}>
                          {portfolioSummary.change >= 0 ? 
                            <ArrowUp className="h-4 w-4 mr-1" /> : 
                            <ArrowDown className="h-4 w-4 mr-1" />
                          }
                          <span>{formatCurrency(Math.abs(portfolioSummary.change))}</span>
                          <span className="ml-1">({formatPercent(Math.abs(portfolioSummary.changePercent))})</span>
                          <span className="ml-2 text-muted-foreground text-sm">Today</span>
                        </div>
                      </div>
                      
                      <div className="hidden md:flex items-center space-x-4">
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                          Deposit
                          <ArrowUp className="ml-1 h-4 w-4" />
                        </Button>
                        <Button variant="default" size="sm">
                          Trade
                          <TrendingUp className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="h-64 mt-6">
                      <StockChart 
                        data={chartData} 
                        positiveChange={portfolioSummary.change >= 0} 
                        minimal={false} 
                      />
                    </div>
                  </div>
                  
                  {/* Stats and Quick Actions */}
                  <div className="p-6 flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Portfolio Statistics</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Buying Power</span>
                          <span className="font-medium">{formatCurrency(portfolioSummary.buyingPower)}</span>
                        </div>
                        <Progress value={portfolioSummary.buyingPower / (portfolioSummary.value + portfolioSummary.buyingPower) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">All-time Return</span>
                          <span className={cn("font-medium", getColorByChange(portfolioSummary.totalGain))}>
                            {portfolioSummary.totalGain >= 0 ? '+' : ''}
                            {formatPercent(portfolioSummary.totalGainPercent)}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div 
                            className={cn("h-2 rounded-full", 
                              portfolioSummary.totalGain >= 0 ? "bg-green-500" : "bg-red-500"
                            )} 
                            style={{ width: `${Math.min(Math.abs(portfolioSummary.totalGainPercent), 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center mb-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Wallet className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Unrealized P/L</div>
                            <div className={cn("font-semibold", getColorByChange(portfolioSummary.totalGain))}>
                              {formatCurrency(portfolioSummary.totalGain)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-auto">
                      <Button className="w-full mt-4" size="sm" variant="default">
                        View Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-muted-foreground" />
                      Portfolio Allocation
                    </CardTitle>
                    <CardDescription>Sector-based allocation of your investments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {allocation.map((sector) => (
                        <div key={sector.name} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{sector.name}</span>
                            <span className="font-medium">{sector.percentage}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full">
                            <div className={`h-2 ${sector.color} rounded-full`} style={{ width: `${sector.percentage}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                      Upcoming Events
                    </CardTitle>
                    <CardDescription>Important dates for your portfolio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <div key={event.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 rounded-md bg-primary/10 p-2">
                            <span className="text-primary font-bold text-sm">
                              {event.date.getDate()}
                            </span>
                            <div className="text-xs">
                              {event.date.toLocaleString('default', { month: 'short' })}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">{event.title}</h4>
                            <p className="text-xs text-muted-foreground">{event.company}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="w-full mt-4">
                      View All Events
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              {/* News Section */}
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="mr-2 h-5 w-5 text-muted-foreground" />
                      Latest News for Your Portfolio
                    </CardTitle>
                    <CardDescription>Recent updates about your investments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {newsLoading ? (
                        <div className="text-center p-4">
                          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                          <p className="text-sm text-muted-foreground mt-2">Loading news...</p>
                        </div>
                      ) : news.length > 0 ? (
                        news.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex border-b border-border pb-4">
                            {item.imageUrl && (
                              <div className="flex-shrink-0 mr-4">
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.title} 
                                  className="w-20 h-20 object-cover rounded-md"
                                />
                              </div>
                            )}
                            <div>
                              <h4 className="font-medium text-sm">{item.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
                              <div className="flex items-center mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {item.source} · {new Date(item.publishedAt).toLocaleDateString()}
                                </span>
                                {item.symbols && item.symbols.length > 0 && (
                                  <div className="ml-2 flex gap-1">
                                    {item.symbols.map(symbol => (
                                      <Badge key={symbol} variant="secondary" className="text-xs">
                                        {symbol}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-4">
                          <p className="text-muted-foreground">No news available for your portfolio</p>
                        </div>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm" className="w-full mt-4" onClick={() => navigate('/financial-news')}>
                      View All News
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="holdings">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  <div className="col-span-full text-center p-8">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-muted-foreground mt-4">Loading your holdings...</p>
                  </div>
                ) : portfolio && portfolio.length > 0 ? (
                  portfolio.map((item) => (
                    <Card key={item.symbol} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback>{item.symbol.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{item.symbol}</h3>
                              <p className="text-xs text-muted-foreground">{item.company_name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(item.average_price)}</div>
                            <div className={cn("text-sm", getColorByChange(item.profit_loss || 0))}>
                              {item.profit_loss_percent && item.profit_loss_percent > 0 ? '+' : ''}
                              {formatPercent(item.profit_loss_percent || 0)}
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Shares</span>
                            <span>{item.shares}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Market Value</span>
                            <span>{formatCurrency(item.total_value || 0)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">P/L</span>
                            <span className={cn(getColorByChange(item.profit_loss || 0))}>
                              {formatCurrency(item.profit_loss || 0)}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" className="w-full mt-4" onClick={() => navigate(`/stocks/${item.symbol}`)}>
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="col-span-full">
                    <CardContent className="text-center py-12">
                      <h3 className="text-xl font-medium mb-2">No Holdings Yet</h3>
                      <p className="text-muted-foreground mb-6">Start your investment journey by adding stocks to your portfolio</p>
                      <Button onClick={() => navigate('/stocks')}>
                        Browse Stocks
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="news">
              <Card>
                <CardContent className="p-6">
                  {newsLoading ? (
                    <div className="text-center p-8">
                      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-muted-foreground mt-4">Loading latest news...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {news.map((item) => (
                        <div key={item.id} className="flex border-b border-border pb-6">
                          {item.imageUrl && (
                            <div className="flex-shrink-0 mr-6">
                              <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className="w-32 h-24 object-cover rounded-md"
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-muted-foreground mt-2">{item.summary}</p>
                            <div className="flex items-center mt-3">
                              <span className="text-sm text-muted-foreground">
                                {item.source} · {new Date(item.publishedAt).toLocaleDateString()}
                              </span>
                              {item.symbols && item.symbols.length > 0 && (
                                <div className="ml-4 flex gap-1">
                                  {item.symbols.map(symbol => (
                                    <Badge key={symbol} variant="secondary">
                                      {symbol}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Button variant="link" className="mt-2 p-0 h-auto" asChild>
                              <a href={item.url} target="_blank" rel="noopener noreferrer">
                                Read Full Article
                                <ArrowRight className="ml-1 h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="events">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.concat(upcomingEvents).map((event, index) => (
                      <Card key={`${event.id}-${index}`} className="overflow-hidden">
                        <div className="bg-primary/10 p-4 flex items-center">
                          <div className="bg-background rounded-lg p-3 mr-4 text-center min-w-16">
                            <span className="text-xl font-bold block">
                              {event.date.getDate()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {event.date.toLocaleString('default', { month: 'short' })}
                            </span>
                          </div>
                          <div>
                            <Badge>{event.type}</Badge>
                            <h4 className="font-medium mt-1">{event.title}</h4>
                          </div>
                        </div>
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">{event.company}</p>
                          <p className="text-sm mt-2">
                            {event.date.toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <Button variant="ghost" size="sm" className="w-full mt-3">
                            Add to Calendar
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
