
import React from 'react';
import NewsCard from './NewsCard';
import { Skeleton } from '@/components/ui/skeleton';
import LoadingState from '@/components/ui/LoadingState';

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

interface NewsGridProps {
  news: NewsItem[];
  displayedNews: NewsItem[];
  isLoading: boolean;
  compact?: boolean;
}

const NewsGrid: React.FC<NewsGridProps> = ({ 
  news, 
  displayedNews, 
  isLoading, 
  compact = false 
}) => {
  const getGridStyle = () => {
    if (compact) {
      return "grid grid-cols-1 gap-4";
    }
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6";
  };

  if (isLoading && news.length === 0) {
    return <LoadingState variant="skeleton" count={compact ? 3 : 6} />;
  }

  return (
    <>
      <div className={getGridStyle()}>
        {displayedNews.map(article => (
          <NewsCard 
            key={article.id} 
            article={article} 
            compact={compact}
          />
        ))}
      </div>
      
      {isLoading && news.length > 0 && (
        <div className="w-full flex justify-center mt-6">
          <LoadingState size="sm" text="Loading more..." />
        </div>
      )}
    </>
  );
};

export default NewsGrid;
