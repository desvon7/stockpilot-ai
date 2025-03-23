
import { FALLBACK_SEARCH_RESULTS } from "../utils/fallbackData.ts";
import { StockSearchResult } from "../types.ts";

export function searchFallbackData(query: string): StockSearchResult[] {
  console.log('Using fallback data for search query:', query);
  
  // If query is empty, return top 20 popular instruments as suggestions
  if (!query || query.trim() === '') {
    return FALLBACK_SEARCH_RESULTS.slice(0, 20);
  }
  
  // Enhanced search with better matching algorithm
  const lowerQuery = query.toLowerCase().trim();
  const results = FALLBACK_SEARCH_RESULTS.filter(item => {
    const symbolMatch = item.symbol.toLowerCase().includes(lowerQuery);
    const nameMatch = item.name.toLowerCase().includes(lowerQuery);
    return symbolMatch || nameMatch;
  });
  
  // Sort results to prioritize symbol matches and exact matches
  return results.sort((a, b) => {
    // Exact symbol match gets highest priority
    if (a.symbol.toLowerCase() === lowerQuery) return -1;
    if (b.symbol.toLowerCase() === lowerQuery) return 1;
    
    // Symbol starts with query gets second priority
    const aStartsWithSymbol = a.symbol.toLowerCase().startsWith(lowerQuery);
    const bStartsWithSymbol = b.symbol.toLowerCase().startsWith(lowerQuery);
    if (aStartsWithSymbol && !bStartsWithSymbol) return -1;
    if (!aStartsWithSymbol && bStartsWithSymbol) return 1;
    
    // Name starts with query gets third priority
    const aStartsWithName = a.name.toLowerCase().startsWith(lowerQuery);
    const bStartsWithName = b.name.toLowerCase().startsWith(lowerQuery);
    if (aStartsWithName && !bStartsWithName) return -1;
    if (!aStartsWithName && bStartsWithName) return 1;
    
    // Default to alphabetical sorting of symbols
    return a.symbol.localeCompare(b.symbol);
  });
}
