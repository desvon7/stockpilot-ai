
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { ChevronUp, ChevronDown } from 'lucide-react';

export type SortField = 'symbol' | 'name' | 'price' | 'change' | 'added';
export type SortDirection = 'asc' | 'desc';

interface SortableTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
  sortField,
  sortDirection,
  onSort
}) => {
  // Function to render sort icons
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <div className="ml-1 opacity-20"><ChevronUp className="h-4 w-4" /></div>;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="ml-1 h-4 w-4" /> 
      : <ChevronDown className="ml-1 h-4 w-4" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="cursor-pointer hover:text-primary flex items-center transition-colors"
          onClick={() => onSort('symbol')}
        >
          <span className="flex items-center">
            Symbol
            {renderSortIcon('symbol')}
          </span>
        </TableHead>
        <TableHead 
          className="cursor-pointer hover:text-primary flex items-center transition-colors"
          onClick={() => onSort('name')}
        >
          <span className="flex items-center">
            Name
            {renderSortIcon('name')}
          </span>
        </TableHead>
        <TableHead 
          className="text-right cursor-pointer hover:text-primary transition-colors"
          onClick={() => onSort('price')}
        >
          <span className="flex items-center justify-end">
            Price
            {renderSortIcon('price')}
          </span>
        </TableHead>
        <TableHead 
          className="text-right cursor-pointer hover:text-primary transition-colors"
          onClick={() => onSort('change')}
        >
          <span className="flex items-center justify-end">
            Change
            {renderSortIcon('change')}
          </span>
        </TableHead>
        <TableHead 
          className="cursor-pointer hover:text-primary transition-colors"
          onClick={() => onSort('added')}
        >
          <span className="flex items-center">
            Added
            {renderSortIcon('added')}
          </span>
        </TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default SortableTableHeader;
