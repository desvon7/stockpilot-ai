
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const NewsPagination: React.FC<NewsPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    // Always show first page
    pages.push(
      <PaginationItem key="page-1">
        <PaginationLink
          isActive={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Calculate range of pages to show
    let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);
    startPage = Math.max(2, endPage - maxPagesToShow + 3);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pages;
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : undefined}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {renderPageNumbers()}
        
        <PaginationItem>
          <PaginationNext
            onClick={() => currentPage < totalPages && onPageChange(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : undefined}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default NewsPagination;
