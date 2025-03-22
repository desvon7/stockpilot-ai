
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface NewsCardSentimentProps {
  sentiment?: number;
}

const NewsCardSentiment: React.FC<NewsCardSentimentProps> = ({ sentiment }) => {
  if (sentiment === undefined || sentiment === null) return null;
  
  // Determine sentiment status
  const getSentimentColor = (sentiment?: number) => {
    if (sentiment === undefined || sentiment === null) return 'text-muted-foreground';
    if (sentiment > 0.25) return 'text-green-500 dark:text-green-400';
    if (sentiment < -0.25) return 'text-red-500 dark:text-red-400';
    return 'text-muted-foreground';
  };
  
  const getSentimentIcon = (sentiment?: number) => {
    return sentiment > 0 ? 
      <TrendingUp className="h-4 w-4 mr-1" /> : 
      <TrendingDown className="h-4 w-4 mr-1" />;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center text-sm", getSentimentColor(sentiment))}>
            {getSentimentIcon(sentiment)}
            <span>{Math.abs(Number(sentiment)).toFixed(2)}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sentiment score: {sentiment > 0 ? 'Positive' : 'Negative'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NewsCardSentiment;
