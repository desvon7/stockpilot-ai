
import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsErrorStateProps {
  refetch: () => void;
  errorMessage?: string;
}

const NewsErrorState: React.FC<NewsErrorStateProps> = ({ 
  refetch,
  errorMessage = 'An error occurred while fetching news. Please try again later.'
}) => (
  <div className="text-center py-8 text-destructive bg-destructive/10 rounded-md p-6">
    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
    <p className="font-medium">Error loading news</p>
    <p className="text-sm mt-2">{errorMessage}</p>
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
);

export default NewsErrorState;
