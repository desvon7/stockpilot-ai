
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import SortableTableHeader, { SortField, SortDirection } from './SortableTableHeader';
import WatchlistTableRow from './WatchlistTableRow';
import { WatchlistItem } from '@/services/portfolioService';

interface WatchlistTableProps {
  items: WatchlistItem[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onRemoveStock: (itemId: string, symbol: string) => Promise<void>;
  isRemoving: boolean;
  itemToRemove: {id: string, symbol: string} | null;
}

const WatchlistTable: React.FC<WatchlistTableProps> = ({
  items,
  sortField,
  sortDirection,
  onSort,
  onRemoveStock,
  isRemoving,
  itemToRemove
}) => {
  return (
    <Table>
      <SortableTableHeader 
        sortField={sortField} 
        sortDirection={sortDirection} 
        onSort={onSort} 
      />
      <TableBody>
        {items.map((item) => (
          <WatchlistTableRow 
            key={item.id}
            item={item}
            onRemove={onRemoveStock}
            isRemoving={isRemoving}
            itemToRemove={itemToRemove}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default WatchlistTable;
