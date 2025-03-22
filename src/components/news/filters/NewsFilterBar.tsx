
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NewsFilterBarProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
  activeFilter: string;
}

const NewsFilterBar: React.FC<NewsFilterBarProps> = ({ 
  categories,
  onSelectCategory,
  activeFilter
}) => {
  const displayName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="mb-4">
      <Tabs defaultValue={activeFilter} value={activeFilter} onValueChange={onSelectCategory}>
        <TabsList className="w-full flex overflow-x-auto">
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="flex-1"
            >
              {displayName(category)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default NewsFilterBar;
