
import React from 'react';
import { Button } from '@/components/ui/button';

interface AssetSearchTriggerProps {
  onClick: () => void;
  customTrigger?: React.ReactNode;
}

const AssetSearchTrigger: React.FC<AssetSearchTriggerProps> = ({ 
  onClick, 
  customTrigger 
}) => {
  if (customTrigger) {
    return React.cloneElement(customTrigger as React.ReactElement, {
      onClick
    });
  }
  
  return (
    <Button
      variant="outline"
      className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
      onClick={onClick}
    >
      <span className="hidden lg:inline-flex">Search assets...</span>
      <span className="inline-flex lg:hidden">Search...</span>
      <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
};

export default AssetSearchTrigger;
