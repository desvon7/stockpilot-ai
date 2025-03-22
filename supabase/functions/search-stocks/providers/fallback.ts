
import { FALLBACK_SEARCH_RESULTS } from "../utils/fallbackData.ts";
import { StockSearchResult } from "../types.ts";

export function searchFallbackData(query: string): StockSearchResult[] {
  console.log('Using fallback data for search query:', query);
  
  // Filter fallback results based on the query
  return FALLBACK_SEARCH_RESULTS.filter(item => 
    item.symbol.toLowerCase().includes(query.toLowerCase()) || 
    item.name.toLowerCase().includes(query.toLowerCase())
  );
}
