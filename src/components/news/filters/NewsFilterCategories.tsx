
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NewsFilterCategoriesProps {
  categories: string[];
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  clearAllCategories: () => void;
}

const NewsFilterCategories: React.FC<NewsFilterCategoriesProps> = ({
  categories,
  addCategory,
  removeCategory,
  clearAllCategories
}) => {
  // Suggested common categories
  const suggestedCategories = ['earnings', 'market', 'tech', 'economy', 'crypto'];
  
  return (
    <div className="p-3 border rounded-md bg-background">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">Filter by Categories</h4>
        {categories.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllCategories}
            className="h-7 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1.5 mb-3">
        {suggestedCategories.map(category => (
          <Badge 
            key={category} 
            variant={categories.includes(category) ? "default" : "outline"}
            className="cursor-pointer capitalize"
            onClick={() => categories.includes(category) 
              ? removeCategory(category) 
              : addCategory(category)
            }
          >
            {category}
          </Badge>
        ))}
      </div>
      
      {categories.length > 0 && (
        <div className="mt-2">
          <h4 className="text-xs font-medium text-muted-foreground mb-1.5">Active filters:</h4>
          <div className="flex flex-wrap gap-1.5">
            {categories.map(category => (
              <Badge key={category} className="flex items-center gap-1 capitalize">
                {category}
                <button 
                  onClick={() => removeCategory(category)}
                  className="ml-1 rounded-full hover:bg-muted"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsFilterCategories;
