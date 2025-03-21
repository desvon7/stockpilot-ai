
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, ArrowUpRight, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import StockSearch from '@/components/ui/StockSearch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMarketData } from '@/hooks/useMarketData';
import LiveMarketData from '@/components/market/LiveMarketData';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent, getColorByChange, getBgColorByChange, getArrowByChange } from '@/utils/formatters';

const StockBrowser: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { data: marketData, isLoading, lastUpdated } = useMarketData();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would typically redirect to search results or filter
    console.log('Searching for:', searchTerm);
  };
  
  const renderMarketSection = (title: string, icon: React.ReactNode, items: any[]) => {
    if (!items || items.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No data available</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-medium">
          {icon}
          <h3>{title}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(0, 6).map((item, index) => {
            const isPositive = !item.change_percentage.includes('-');
            const changePercent = parseFloat(item.change_percentage.replace('%', ''));
            
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{item.ticker}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => navigate(`/stocks/${item.ticker}`)}
                    >
                      <ArrowUpRight size={16} />
                    </Button>
                  </CardTitle>
                  <CardDescription className="truncate">{item.price_change}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">${parseFloat(item.price).toFixed(2)}</span>
                    <span className={cn(
                      "px-2 py-1 rounded text-sm font-medium flex items-center gap-1",
                      isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    )}>
                      {isPositive ? "+" : ""}{item.change_percentage}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Vol: {parseInt(item.volume).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <>
      <Helmet>
        <title>Browse Stocks | StockPilot</title>
      </Helmet>
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-6">Stock Browser</h1>
          
          <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Search for Stocks</h2>
            <StockSearch className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              Search by company name or stock symbol to find stocks to add to your portfolio
            </p>
          </div>
        </div>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6">Market Highlights</h2>
            <LiveMarketData />
          </section>
          
          {marketData && (
            <>
              <section>
                {renderMarketSection(
                  "Top Gainers", 
                  <TrendingUp className="text-success" />, 
                  marketData.top_gainers || []
                )}
              </section>
              
              <section>
                {renderMarketSection(
                  "Top Losers", 
                  <TrendingDown className="text-destructive" />, 
                  marketData.top_losers || []
                )}
              </section>
              
              <section>
                {renderMarketSection(
                  "Most Active", 
                  <BarChart2 className="text-primary" />, 
                  marketData.most_actively_traded || []
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default StockBrowser;
