
import { useState, useEffect } from 'react';
import { AssetSearchResult } from '@/types/search';

export const useAssetSearch = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AssetSearchResult[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Mock search results - this would be replaced with a real API call
    const mockSearch = setTimeout(() => {
      // Fix: Explicitly specify the correct string literal type for each mock result
      const mockResults: AssetSearchResult[] = [
        { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' as const, price: 175.34, change: 1.2 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock' as const, price: 326.78, change: -0.8 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock' as const, price: 135.12, change: 0.5 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock' as const, price: 130.22, change: -0.3 },
        { symbol: 'TSLA', name: 'Tesla, Inc.', type: 'stock' as const, price: 250.15, change: 2.1 },
        { symbol: 'BTC', name: 'Bitcoin', type: 'crypto' as const, price: 68432.10, change: 3.2 },
        { symbol: 'ETH', name: 'Ethereum', type: 'crypto' as const, price: 3245.67, change: 1.5 },
        { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'etf' as const, price: 420.69, change: 0.1 },
      ].filter(item => 
        item.symbol.toLowerCase().includes(query.toLowerCase()) || 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(mockResults);
      setLoading(false);
    }, 300);

    return () => clearTimeout(mockSearch);
  }, [query]);

  return {
    query,
    setQuery,
    loading,
    results
  };
};
