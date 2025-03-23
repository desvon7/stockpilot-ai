
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStockNews } from '@/hooks/useStockNews';
import { toast } from 'sonner';
import LoadingState from '@/components/ui/LoadingState';
import NewsGrid from '@/components/news/NewsGrid';
import NewsErrorState from '@/components/news/states/NewsErrorState';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

const NewsFeed: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Popular tech and financial stocks for news tracking
  const trackedSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
  
  // Fetch news for tracked symbols
  const { news, isLoading, error, refetch } = useStockNews(trackedSymbols);
  
  // Filter news by category if needed
  const filteredNews = activeCategory === 'all' 
    ? news 
    : news.filter(item => {
        const lowerTitle = item.title.toLowerCase();
        const lowerSummary = item.summary.toLowerCase();
        
        switch(activeCategory) {
          case 'earnings':
            return lowerTitle.includes('earnings') || 
                   lowerTitle.includes('revenue') ||
                   lowerSummary.includes('earnings') ||
                   lowerSummary.includes('quarterly');
          case 'market':
            return lowerTitle.includes('market') ||
                   lowerTitle.includes('index') ||
                   lowerTitle.includes('stocks') ||
                   lowerSummary.includes('market') ||
                   lowerTitle.includes('fed') ||
                   lowerTitle.includes('federal reserve') ||
                   lowerSummary.includes('rate') ||
                   lowerSummary.includes('investor');
          case 'tech':
            return lowerTitle.includes('tech') ||
                   lowerTitle.includes('technology') ||
                   lowerSummary.includes('technology') ||
                   lowerSummary.includes('ai') ||
                   lowerSummary.includes('artificial intelligence') ||
                   lowerSummary.includes('cloud');
          default:
            return true;
        }
      });

  if (error) {
    toast.error('Failed to fetch news data. Please try again later.');
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Financial News | StockPilot</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">Financial News</h1>
        
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-6 w-full sm:w-auto flex overflow-x-auto py-1">
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="tech">Technology</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeCategory}>
            <Card>
              <CardHeader>
                <CardTitle>{activeCategory === 'all' ? 'Latest Financial News' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} News`}</CardTitle>
                <CardDescription>
                  Updates and insights to help you stay informed about the financial markets
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <LoadingState 
                    variant="skeleton" 
                    count={6}
                  />
                ) : error ? (
                  <NewsErrorState refetch={refetch} />
                ) : filteredNews.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <p>No news articles found for this category.</p>
                  </div>
                ) : (
                  <NewsGrid 
                    news={filteredNews} 
                    displayedNews={filteredNews} 
                    isLoading={false}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default NewsFeed;
