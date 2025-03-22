
import React from 'react';
import { Loader2 } from 'lucide-react';

interface NewsLoadingStateProps {
  isFullPage?: boolean;
}

const NewsLoadingState: React.FC<NewsLoadingStateProps> = ({ isFullPage = true }) => (
  <div className={`flex flex-col justify-center items-center ${isFullPage ? 'py-16' : 'py-6'} text-center`}>
    <Loader2 className={`${isFullPage ? 'h-12 w-12' : 'h-6 w-6'} animate-spin text-primary mb-4`} />
    <div>
      <p className="font-medium">Loading financial news...</p>
      <p className="text-xs text-muted-foreground mt-1">
        Fetching from multiple sources for the most comprehensive coverage
      </p>
    </div>
  </div>
);

export default NewsLoadingState;
