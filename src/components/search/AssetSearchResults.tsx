
import React from 'react';
import { CommandEmpty, CommandGroup, CommandList } from "@/components/ui/command";
import AssetSearchResultItem from './AssetSearchResultItem';
import { AssetSearchResult } from '@/types/search';

interface AssetSearchResultsProps {
  results: AssetSearchResult[];
  loading: boolean;
  onSelectAsset: (asset: AssetSearchResult) => void;
}

const AssetSearchResults: React.FC<AssetSearchResultsProps> = ({ 
  results, 
  loading, 
  onSelectAsset 
}) => {
  const stockResults = results.filter(r => r.type === 'stock');
  const cryptoResults = results.filter(r => r.type === 'crypto');
  const etfResults = results.filter(r => r.type === 'etf');

  return (
    <CommandList>
      <CommandEmpty>
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
            <span className="ml-2">Searching...</span>
          </div>
        ) : (
          <p>No results found.</p>
        )}
      </CommandEmpty>
      
      {results.length > 0 && (
        <>
          {stockResults.length > 0 && (
            <CommandGroup heading="Stocks">
              {stockResults.map((result) => (
                <AssetSearchResultItem 
                  key={result.symbol} 
                  result={result} 
                  onSelect={onSelectAsset} 
                />
              ))}
            </CommandGroup>
          )}
          
          {cryptoResults.length > 0 && (
            <CommandGroup heading="Crypto">
              {cryptoResults.map((result) => (
                <AssetSearchResultItem 
                  key={result.symbol} 
                  result={result} 
                  onSelect={onSelectAsset} 
                />
              ))}
            </CommandGroup>
          )}
          
          {etfResults.length > 0 && (
            <CommandGroup heading="ETFs">
              {etfResults.map((result) => (
                <AssetSearchResultItem 
                  key={result.symbol} 
                  result={result} 
                  onSelect={onSelectAsset} 
                />
              ))}
            </CommandGroup>
          )}
        </>
      )}
    </CommandList>
  );
};

export default AssetSearchResults;
