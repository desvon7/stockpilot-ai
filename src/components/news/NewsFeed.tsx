
import React, { useState } from 'react';
import NewsGrid from './NewsGrid';
import NewsFilterBar from './filters/NewsFilterBar';
import NewsLoadingState from './states/NewsLoadingState';
import NewsErrorState from './states/NewsErrorState';
import NewsEmptyState from './states/NewsEmptyState';
import NewsSourceInfo from './NewsSourceInfo';
import { useStockNews } from '@/hooks/useStockNews';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface NewsFeedProps {
  title?: string;
  symbols?: string[];
  categories?: string[];
  maxItems?: number;
  showFilters?: boolean;
  isCompact?: boolean;
}

const NewsFeed: React.FC<NewsFeedProps> = ({
  title = 'Financial News',
  symbols = [],
  categories = ['general'],
  maxItems = 12,
  showFilters = true,
  isCompact = false
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || 'general');
  const [viewAll, setViewAll] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  // Use the stock news hook for fetching data
  const {
    news,
    isLoading,
    error,
    refetch,
    newsSource
  } = useStockNews(symbols, [activeCategory]);
  
  // Calculate number of items to show
  const displayCount = viewAll ? undefined : maxItems;
  
  // Filter and slice the news items
  const displayedNews = news.slice(0, displayCount);
  
  // Calculate source distribution
  const getSourceCount = () => {
    const counts: Record<string, number> = {};
    news.forEach(item => {
      counts[item.source] = (counts[item.source] || 0) + 1;
    });
    return counts;
  };
  
  const sourceCount = getSourceCount();
  
  // Function to clear all category filters
  const clearAllCategories = () => {
    setActiveCategory(categories[0] || 'general');
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
          {news.length > maxItems && !viewAll && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setViewAll(true)}
            >
              View All
            </Button>
          )}
        </div>
        
        {!isLoading && !error && news.length > 0 && (
          <NewsSourceInfo 
            news={news} 
            sourceCount={sourceCount} 
            newsSource={newsSource} 
          />
        )}
      </CardHeader>
      
      <CardContent className="px-4 sm:px-6 pb-6">
        {showFilters && categories.length > 1 && !isLoading && !error && news.length > 0 && (
          <div className="mb-6">
            <NewsFilterBar 
              categories={categories}
              onSelectCategory={(category) => setActiveCategory(category)}
              activeFilter={activeCategory}
            />
          </div>
        )}
        
        {isLoading ? (
          <NewsLoadingState isFullPage={false} message="Fetching latest financial news..." />
        ) : error ? (
          <NewsErrorState refetch={refetch} />
        ) : !news.length ? (
          <NewsEmptyState 
            searchInput={searchInput} 
            categories={[activeCategory]} 
            clearAllCategories={clearAllCategories} 
          />
        ) : (
          <>
            <NewsGrid 
              news={news} 
              displayedNews={displayedNews}
              isLoading={isLoading}
              compact={isCompact} 
            />
            
            {news.length > maxItems && !viewAll && (
              <div className="flex justify-center mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setViewAll(true)}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsFeed;
