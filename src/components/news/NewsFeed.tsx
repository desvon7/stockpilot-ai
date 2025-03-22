
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useStockNews } from '@/hooks/useStockNews';
import NewsCard from './NewsCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

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
  
  const { news, isLoading, error } = useStockNews(symbols, categories);
  
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
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      
      <div className="flex flex-col space-y-3">
        <Input
          placeholder="Search news or add category..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full"
        />
        
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                {category}
                <button onClick={() => removeCategory(category)}>
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading news...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">
          <p>Error loading news. Please try again later.</p>
        </div>
      ) : displayedNews.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No news articles found.</p>
          {categories.length > 0 && (
            <p className="text-sm mt-2">Try removing some category filters.</p>
          )}
          {symbols.length === 0 && (
            <p className="text-sm mt-2">Add stocks to your watchlist to see related news.</p>
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
    </div>
  );
};

export default NewsFeed;
