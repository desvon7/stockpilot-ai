
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SearchDialogContent from '@/components/search/SearchDialogContent';

interface GlobalAssetSearchProps {
  darkMode?: boolean;
  trigger?: React.ReactNode;
}

const GlobalAssetSearch: React.FC<GlobalAssetSearchProps> = ({ 
  darkMode = false,
  trigger
}) => {
  const [open, setOpen] = useState(false);

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
            className="relative w-full rounded-full pr-12 justify-start text-muted-foreground"
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search assets...</span>
            <kbd className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-[600px] p-0">
        <SearchDialogContent 
          darkMode={darkMode} 
          onClose={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default GlobalAssetSearch;
