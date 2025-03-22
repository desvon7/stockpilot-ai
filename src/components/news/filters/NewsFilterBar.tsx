
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import NewsFilterCategories from './NewsFilterCategories';

interface NewsFilterBarProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  categories: string[];
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  clearAllCategories: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const NewsFilterBar: React.FC<NewsFilterBarProps> = ({
  searchInput,
  setSearchInput,
  categories,
  addCategory,
  removeCategory,
  clearAllCategories,
  handleKeyDown
}) => {
  const [isFiltering, setIsFiltering] = useState(false);

  return (
    <div className="flex flex-col space-y-3 mb-4">
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search news or add category..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-8"
          />
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setIsFiltering(!isFiltering)}
          className={isFiltering ? 'bg-secondary' : ''}
        >
          <Filter size={16} />
        </Button>
      </div>
      
      {isFiltering && (
        <NewsFilterCategories 
          categories={categories}
          addCategory={addCategory}
          removeCategory={removeCategory}
          clearAllCategories={clearAllCategories}
        />
      )}
    </div>
  );
};

export default NewsFilterBar;
