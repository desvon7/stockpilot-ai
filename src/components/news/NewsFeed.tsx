
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import NewsGrid from './NewsGrid';
import NewsFilterBar from './filters/NewsFilterBar';
import NewsLoadingState from './states/NewsLoadingState';
import NewsErrorState from './states/NewsErrorState';
import NewsEmptyState from './states/NewsEmptyState';
import NewsSourceInfo from './NewsSourceInfo';
import { useStockNews } from '@/hooks/useStockNews';
import { Button } from '@/components/ui/button';

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
  
  // Show the appropriate state based on the query status
  if (isLoading) {
    return <NewsLoadingState isFullPage={false} />;
  }
  
  if (error) {
    return <NewsErrorState refetch={refetch} />;
  }
  
  if (!news.length) {
    return <NewsEmptyState 
      searchInput={searchInput} 
      categories={[activeCategory]} 
      clearAllCategories={clearAllCategories} 
    />;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
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
      
      <NewsSourceInfo 
        news={news} 
        sourceCount={sourceCount} 
        newsSource={newsSource} 
      />
      
      {showFilters && categories.length > 1 && (
        <NewsFilterBar 
          categories={categories}
          onSelectCategory={(category) => setActiveCategory(category)}
          activeFilter={activeCategory}
        />
      )}
      
      <NewsGrid 
        news={displayedNews} 
        displayedNews={displayedNews}
        isLoading={false}
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
    </div>
  );
};

export default NewsFeed;
