
import React from 'react';
import LoadingState from '@/components/ui/LoadingState';

interface NewsLoadingStateProps {
  isFullPage?: boolean;
  message?: string;
}

const NewsLoadingState: React.FC<NewsLoadingStateProps> = ({ 
  isFullPage = true,
  message = 'Loading financial news...'
}) => (
  <LoadingState 
    text={message}
    fullPage={isFullPage}
    size={isFullPage ? "lg" : "md"}
  />
);

export default NewsLoadingState;
