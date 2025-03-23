
import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface NewsErrorStateProps {
  refetch: () => void;
  errorMessage?: string;
}

const NewsErrorState: React.FC<NewsErrorStateProps> = ({ 
  refetch,
  errorMessage = 'An error occurred while fetching news. Please try again later.'
}) => (
  <Alert variant="destructive" className="text-center py-6">
    <AlertCircle className="h-6 w-6 mx-auto mb-2" />
    <AlertTitle className="text-center">Error loading news</AlertTitle>
    <AlertDescription className="text-center">
      <p className="mt-2">{errorMessage}</p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => refetch()}
        className="mt-4"
      >
        <RefreshCcw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </AlertDescription>
  </Alert>
);

export default NewsErrorState;
