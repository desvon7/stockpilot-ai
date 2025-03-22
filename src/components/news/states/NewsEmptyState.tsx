
import React from 'react';
import { Button } from '@/components/ui/button';

interface NewsEmptyStateProps {
  searchInput: string;
  categories: string[];
  clearAllCategories: () => void;
}

const NewsEmptyState: React.FC<NewsEmptyStateProps> = ({ 
  searchInput, 
  categories, 
  clearAllCategories 
}) => (
  <div className="text-center py-8 text-muted-foreground">
    {searchInput.trim() ? (
      <p>No news articles found matching "{searchInput.trim()}".</p>
    ) : categories.length > 0 ? (
      <>
        <p>No news articles found for the selected categories.</p>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearAllCategories}
          className="mt-2"
        >
          Clear All Filters
        </Button>
      </>
    ) : (
      <p>No news articles found for these symbols.</p>
    )}
  </div>
);

export default NewsEmptyState;
