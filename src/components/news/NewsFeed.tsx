
import React, { useState, useCallback } from 'react';
import { RefreshCcw } from 'lucide-react';
import { useStockNews } from '@/hooks/useStockNews';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import NewsFilterBar from './filters/NewsFilterBar';
import NewsSourceInfo from './NewsSourceInfo';
import NewsLoadingState from './states/NewsLoadingState';
import NewsErrorState from './states/NewsErrorState';
import NewsEmptyState from './states/NewsEmptyState';
import NewsGrid from './NewsGrid';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  symbols?: string[];
  sentiment?: number;
}

interface NewsFeedProps {
  symbols: string[];
  title?: string;
  maxItems?: number;
  showRefresh?: boolean;
  compact?: boolean;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ 
  symbols, 
  title = "Financial News", 
  maxItems = 20,
  showRefresh = true,
  compact = false
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  
  const { news, isLoading, error, refetch, newsSource } = useStockNews(symbols, categories);
  
  const handleRefresh = useCallback(() => {
    toast.promise(refetch(), {
      loading: 'Refreshing news...',
      success: 'Latest news loaded',
      error: 'Failed to refresh news'
    });
  }, [refetch]);
  
  const addCategory = useCallback((category: string) => {
    if (category && !categories.includes(category)) {
      setCategories([...categories, category]);
      setSearchInput('');
    }
  }, [categories]);
  
  const removeCategory = useCallback((category: string) => {
    setCategories(categories.filter(c => c !== category));
  }, [categories]);
  
  const clearAllCategories = useCallback(() => {
    setCategories([]);
  }, []);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      addCategory(searchInput.trim());
    }
  };
  
  // Filter news based on search input for immediate results
  const filteredNews = searchInput
    ? news.filter(article => 
        article.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchInput.toLowerCase())
      )
    : news;
  
  // Limit the number of displayed items
  const displayedNews = filteredNews.slice(0, maxItems);

  // Group news by source for analysis
  const sourceCount = news.reduce((acc: Record<string, number>, article) => {
    acc[article.source] = (acc[article.source] || 0) + 1;
    return acc;
  }, {});
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {symbols.length > 0 
                ? `Latest news for ${symbols.slice(0, 3).join(', ')}${symbols.length > 3 ? ` and ${symbols.length - 3} more` : ''}`
                : 'Latest financial market news'}
            </CardDescription>
          </div>
          {showRefresh && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isLoading}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <NewsFilterBar 
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          categories={categories}
          addCategory={addCategory}
          removeCategory={removeCategory}
          clearAllCategories={clearAllCategories}
          handleKeyDown={handleKeyDown}
        />
        
        <NewsSourceInfo 
          news={news}
          sourceCount={sourceCount}
          newsSource={newsSource}
        />
        
        {isLoading && news.length === 0 ? (
          <NewsLoadingState />
        ) : error ? (
          <NewsErrorState refetch={refetch} />
        ) : displayedNews.length === 0 ? (
          <NewsEmptyState 
            searchInput={searchInput}
            categories={categories}
            clearAllCategories={clearAllCategories}
          />
        ) : (
          <NewsGrid 
            news={news}
            displayedNews={displayedNews}
            isLoading={isLoading}
            compact={compact}
          />
        )}
      </CardContent>
      
      {(!compact && news.length > maxItems) && (
        <CardFooter className="flex justify-center border-t pt-4">
          <Button variant="outline" size="sm">
            View More News
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default NewsFeed;
