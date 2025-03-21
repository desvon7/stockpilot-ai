
import React, { forwardRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean;
  darkMode?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, isLoading, darkMode = false, ...props }, ref) => {
    return (
      <div className={cn('relative', darkMode ? 'text-white' : '')}>
        <Search 
          className={cn(
            'absolute left-3 top-1/2 transform -translate-y-1/2', 
            darkMode ? 'text-gray-500' : 'text-muted-foreground'
          )} 
          size={18} 
        />
        <input
          ref={ref}
          type="text"
          placeholder="Search stocks..."
          className={cn(
            'w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2',
            darkMode 
              ? 'bg-gray-900 border border-gray-800 text-white focus:ring-primary/50' 
              : 'bg-muted focus:ring-primary',
            props.disabled ? 'opacity-50 cursor-not-allowed' : '',
            className
          )}
          {...props}
        />
        {isLoading && (
          <Loader2 
            className={cn(
              'absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin',
              darkMode ? 'text-gray-400' : 'text-primary'
            )} 
            size={18} 
          />
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
