
import React from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

interface NewsErrorStateProps {
  refetch: () => void;
  errorMessage?: string;
  className?: string;
  showHomeButton?: boolean;
}

const NewsErrorState: React.FC<NewsErrorStateProps> = ({ 
  refetch,
  errorMessage = 'An error occurred while fetching news. Please try again later.',
  className,
  showHomeButton = false
}) => (
  <Alert variant="destructive" className={`text-center py-6 ${className || ''}`}>
    <AlertCircle className="h-6 w-6 mx-auto mb-2" />
    <AlertTitle className="text-center text-lg">Error loading data</AlertTitle>
    <AlertDescription className="text-center">
      <p className="mt-2 text-sm">{errorMessage}</p>
      <div className="flex justify-center gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        
        {showHomeButton && (
          <Button 
            variant="outline" 
            size="sm" 
            asChild
          >
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Link>
          </Button>
        )}
      </div>
    </AlertDescription>
  </Alert>
);

export default NewsErrorState;
