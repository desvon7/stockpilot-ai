
import React, { useState, useEffect } from 'react';
import { Search, Command, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SearchDialogContent from '@/components/search/SearchDialogContent';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { useHotkeys } from '@/hooks/useHotkeys';

interface GlobalAssetSearchProps {
  darkMode?: boolean;
  trigger?: React.ReactNode;
}

const GlobalAssetSearch: React.FC<GlobalAssetSearchProps> = ({ 
  darkMode = false,
  trigger
}) => {
  const [open, setOpen] = useState(false);
  
  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="relative w-full rounded-full pr-12 justify-start text-muted-foreground hover:bg-muted/50"
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search assets...</span>
            <kbd className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent 
        className="sm:max-w-[600px] p-0 overflow-hidden" 
        onInteractOutside={(e) => {
          // Prevent closing when clicking inside the dialog
          e.preventDefault();
        }}
      >
        <DialogTitle className="sr-only">
          <VisuallyHidden>Search Assets</VisuallyHidden>
        </DialogTitle>
        <DialogDescription className="sr-only">
          <VisuallyHidden>Search for stocks, ETFs, and other assets</VisuallyHidden>
        </DialogDescription>
        <SearchDialogContent 
          darkMode={darkMode} 
          onClose={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default GlobalAssetSearch;
