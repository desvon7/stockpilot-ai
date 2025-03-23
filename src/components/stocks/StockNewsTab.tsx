
import React, { useState } from 'react';
import { useStockNews } from '@/hooks/useStockNews';
import NewsCard from '@/components/news/NewsCard';
import { Loader2, RefreshCw, AlertCircle, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StockNewsTabProps {
  stockName: string;
  symbol: string;
}

const StockNewsTab: React.FC<StockNewsTabProps> = ({ stockName, symbol }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { news, newsSource, isLoading, error, refetch } = useStockNews([symbol]);

  const handleRefresh = () => {
    refetch();
  };

  // Extract categories from news items for filtering
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set<string>();
    
    news.forEach(item => {
      // Extract categories from title and summary using keyword matching
      const keywords = {
        earnings: ['earnings', 'revenue', 'profit', 'quarterly', 'financial results'],
        market: ['market', 'index', 'stocks', 'bonds', 'shares', 'trading'],
        economy: ['economy', 'inflation', 'federal reserve', 'interest rates', 'economic'],
        technology: ['technology', 'tech', 'innovation', 'digital', 'software', 'hardware'],
        crypto: ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'token', 'digital currency'],
      };
      
      const text = (item.title + ' ' + item.summary).toLowerCase();
      
      Object.entries(keywords).forEach(([category, terms]) => {
        if (terms.some(term => text.includes(term))) {
          uniqueCategories.add(category);
        }
      });
    });
    
    return ['all', ...Array.from(uniqueCategories)];
  }, [news]);

  // Filter news by category
  const filteredNews = React.useMemo(() => {
    if (activeCategory === 'all') return news;
    
    const keywords = {
      earnings: ['earnings', 'revenue', 'profit', 'quarterly', 'financial results'],
      market: ['market', 'index', 'stocks', 'bonds', 'shares', 'trading'],
      economy: ['economy', 'inflation', 'federal reserve', 'interest rates', 'economic'],
      technology: ['technology', 'tech', 'innovation', 'digital', 'software', 'hardware'],
      crypto: ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'token', 'digital currency'],
    };
    
    return news.filter(item => {
      const text = (item.title + ' ' + item.summary).toLowerCase();
      return keywords[activeCategory as keyof typeof keywords]?.some(term => text.includes(term));
    });
  }, [news, activeCategory]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Latest News</CardTitle>
            <CardDescription>Recent news and announcements about {stockName}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      {categories.length > 1 && (
        <div className="px-6 pb-2">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="w-full">
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}
      
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
            <span>Loading news...</span>
          </div>
        ) : error ? (
          <div className="text-center py-6 text-destructive bg-destructive/10 rounded-md p-4">
            <AlertCircle className="h-6 w-6 mx-auto mb-2" />
            <p className="font-medium">Error loading news</p>
            <p className="text-sm mt-1">Please try again later.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No {activeCategory !== 'all' ? activeCategory + ' ' : ''}news found for {stockName}.</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setActiveCategory('all')}
              className="mt-2"
            >
              Show All News
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNews.map((newsItem) => (
              <NewsCard 
                key={newsItem.id} 
                article={newsItem} 
                showDate={true}
                highlightSymbols={[symbol]}
              />
            ))}
          </div>
        )}
      </CardContent>
      {newsSource && filteredNews.length > 0 && (
        <CardFooter className="text-xs text-muted-foreground border-t pt-4">
          <div className="flex items-center">
            <span className="mr-2">News source:</span>
            <Badge variant="outline">{newsSource}</Badge>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default StockNewsTab;
