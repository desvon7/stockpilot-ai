
import React, { useState, useCallback } from 'react';
import { Loader2, RefreshCcw, AlertCircle, Search, X, Filter } from 'lucide-react';
import { useStockNews } from '@/hooks/useStockNews';
import NewsCard from './NewsCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [isFiltering, setIsFiltering] = useState(false);
  
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
  
  // Suggested common categories
  const suggestedCategories = ['earnings', 'market', 'tech', 'economy', 'crypto'];
  
  // Select display style based on compact mode
  const getCardStyle = () => {
    if (compact) {
      return "grid grid-cols-1 gap-4";
    }
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
  };
  
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
        <div className="flex flex-col space-y-3 mb-4">
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search news or add category..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-8"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsFiltering(!isFiltering)}
              className={isFiltering ? 'bg-secondary' : ''}
            >
              <Filter size={16} />
            </Button>
          </div>
          
          {isFiltering && (
            <div className="p-3 border rounded-md bg-background">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Filter by Categories</h4>
                {categories.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAllCategories}
                    className="h-7 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-3">
                {suggestedCategories.map(category => (
                  <Badge 
                    key={category} 
                    variant={categories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => categories.includes(category) 
                      ? removeCategory(category) 
                      : addCategory(category)
                    }
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              
              {categories.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-xs font-medium text-muted-foreground mb-1.5">Active filters:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map(category => (
                      <Badge key={category} className="flex items-center gap-1 capitalize">
                        {category}
                        <button 
                          onClick={() => removeCategory(category)}
                          className="ml-1 rounded-full hover:bg-muted"
                        >
                          <X size={14} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Show sources info */}
        {news.length > 0 && Object.keys(sourceCount).length > 0 && newsSource && (
          <div className="bg-muted/40 p-2 rounded text-xs mb-4">
            <p className="text-muted-foreground flex items-center justify-between">
              <span>
                Source: <Badge variant="outline">{newsSource}</Badge>
              </span>
              <span>
                {Object.keys(sourceCount).length} publishers, {news.length} articles
              </span>
            </p>
          </div>
        )}
        
        {isLoading && news.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-16 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <div>
              <p className="font-medium">Loading financial news...</p>
              <p className="text-xs text-muted-foreground mt-1">
                Fetching from multiple sources for the most comprehensive coverage
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive bg-destructive/10 rounded-md p-6">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">Error loading news</p>
            <p className="text-sm mt-2">An error occurred while fetching news. Please try again later.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="mt-4"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : displayedNews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchInput.trim() ? (
              <p>No news articles found matching "{searchInput.trim()}".</p>
            ) : categories.length > 0 ? (
              <>
                <p>No news articles found for the selected categories.</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllCategories}
                  className="mt-2"
                >
                  Clear All Filters
                </Button>
              </>
            ) : (
              <p>No news articles found for these symbols.</p>
            )}
          </div>
        ) : (
          <div className={getCardStyle()}>
            {isLoading && news.length === 0 ? (
              // Skeleton loading state
              Array(compact ? 3 : 6).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[180px] w-full rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))
            ) : (
              displayedNews.map(article => (
                <NewsCard 
                  key={article.id} 
                  article={article} 
                  compact={compact}
                />
              ))
            )}
          </div>
        )}
        
        {isLoading && news.length > 0 && (
          <div className="w-full flex justify-center mt-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
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
