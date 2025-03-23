
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommandDialog, CommandInput } from "@/components/ui/command";
import AssetSearchResults from './AssetSearchResults';
import AssetSearchTrigger from './AssetSearchTrigger';
import { useAssetSearch } from '@/hooks/useAssetSearch';
import { AssetSearchResult } from '@/types/search';

interface GlobalAssetSearchProps {
  darkMode?: boolean;
  trigger?: React.ReactNode;
}

const GlobalAssetSearch: React.FC<GlobalAssetSearchProps> = ({ 
  darkMode = false,
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const { query, setQuery, loading, results } = useAssetSearch();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelectAsset = (asset: AssetSearchResult) => {
    setOpen(false);
    
    if (asset.type === 'stock' || asset.type === 'etf') {
      navigate(`/stocks/${asset.symbol}`);
    } else if (asset.type === 'crypto') {
      navigate(`/crypto/${asset.symbol}`);
    }
  };

  return (
    <div ref={searchRef}>
      <AssetSearchTrigger 
        onClick={() => setOpen(true)}
        customTrigger={trigger}
      />
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search for stocks, crypto, ETFs..."
          value={query}
          onValueChange={setQuery}
        />
        <AssetSearchResults 
          results={results}
          loading={loading}
          onSelectAsset={handleSelectAsset}
        />
      </CommandDialog>
    </div>
  );
};

export default GlobalAssetSearch;
