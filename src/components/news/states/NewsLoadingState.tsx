
import React from 'react';
import LoadingState from '@/components/ui/LoadingState';

interface NewsLoadingStateProps {
  isFullPage?: boolean;
  message?: string;
  className?: string;
}

const NewsLoadingState: React.FC<NewsLoadingStateProps> = ({ 
  isFullPage = true,
  message = 'Loading financial news...',
  className
}) => (
  <LoadingState 
    text={message}
    fullPage={isFullPage}
    size={isFullPage ? "lg" : "md"}
    className={className}
  />
);

export default NewsLoadingState;
