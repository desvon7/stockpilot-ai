
import React, { useState } from 'react';
import { Loader2, RefreshCcw, AlertCircle, Search, X } from 'lucide-react';
import { useStockNews } from '@/hooks/useStockNews';
import NewsCard from './NewsCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
}

const NewsFeed: React.FC<NewsFeedProps> = ({ 
  symbols, 
  title = "Financial News", 
  maxItems = 20
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  
  const { news, isLoading, error, refetch, newsSource } = useStockNews(symbols, categories);
  
  const addCategory = (category: string) => {
    if (category && !categories.includes(category)) {
      setCategories([...categories, category]);
      setSearchInput('');
    }
  };
  
  const removeCategory = (category: string) => {
    setCategories(categories.filter(c => c !== category));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      addCategory(searchInput.trim());
    }
  };
  
  // Filter news based on search input
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
    <Card>
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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => refetch()} 
            disabled={isLoading}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col space-y-3 mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news or add category..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-8"
            />
          </div>
          
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
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
            <p>No news articles found.</p>
            {categories.length > 0 && (
              <p className="text-sm mt-2">Try removing some category filters.</p>
            )}
            {symbols.length > 0 && (
              <p className="text-sm mt-2">No recent news for these symbols. Try different ones.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedNews.map(article => (
              <NewsCard 
                key={article.id} 
                article={article} 
              />
            ))}
          </div>
        )}
        
        {isLoading && news.length > 0 && (
          <div className="w-full flex justify-center mt-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsFeed;
