
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NewsCard from '@/components/news/NewsCard';
import { useStockNews } from '@/hooks/useStockNews';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const NewsFeed: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Popular tech and financial stocks for news tracking
  const trackedSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
  
  // Fetch news for tracked symbols
  const { news, isLoading, error } = useStockNews(trackedSymbols);
  
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
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Financial News</h1>
        
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="tech">Technology</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeCategory}>
            <Card>
              <CardHeader>
                <CardTitle>{activeCategory === 'all' ? 'Latest Financial News' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} News`}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading news...</span>
                  </div>
                ) : filteredNews.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <p>No news articles found for this category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews.map((article) => (
                      <NewsCard key={article.id} article={article} className="h-full" />
                    ))}
                  </div>
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
