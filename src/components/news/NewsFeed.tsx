
import React, { useState, useEffect } from 'react';
import NewsGrid from './NewsGrid';
import NewsFilterBar from './filters/NewsFilterBar';
import NewsLoadingState from './states/NewsLoadingState';
import NewsErrorState from './states/NewsErrorState';
import NewsEmptyState from './states/NewsEmptyState';
import NewsSourceInfo from './NewsSourceInfo';
import NewsPagination from './pagination/NewsPagination';
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
  className?: string;
}

const NewsFeed: React.FC<NewsFeedProps> = ({
  title = 'Financial News',
  symbols = [],
  categories = ['general'],
  maxItems = 12,
  showFilters = true,
  isCompact = false,
  className
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || 'general');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(isCompact ? 6 : maxItems);
  
  // Use the stock news hook for fetching data
  const {
    news,
    isLoading,
    error,
    refetch,
    newsSource,
    isRefetching
  } = useStockNews(symbols, [activeCategory]);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchInput]);
  
  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(news.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // Filter and slice the news items
  const displayedNews = news.slice(startIndex, endIndex);
  
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

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of news feed
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
          
          {!isLoading && !error && news.length > 0 && (
            <div className="flex items-center space-x-2">
              <select 
                className="bg-background border border-input rounded-md text-sm px-2 py-1"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={6}>6 per page</option>
                <option value={12}>12 per page</option>
                <option value={24}>24 per page</option>
              </select>
            </div>
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
              isLoadingMore={isRefetching} 
            />
            
            {news.length > itemsPerPage && (
              <NewsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsFeed;
