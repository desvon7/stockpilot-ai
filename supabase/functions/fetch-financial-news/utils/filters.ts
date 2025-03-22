
import { NewsItem } from "../types.ts";

// Filter news by categories with improved relevance scoring
export function filterNewsByCategories(news: NewsItem[], categories?: string[]): NewsItem[] {
  if (!categories || categories.length === 0) {
    return news;
  }
  
  // Map articles to a relevance score based on keyword matches
  const articlesWithRelevance = news.map(article => {
    let relevanceScore = 0;
    
    // Normalize strings for better matching
    const titleLower = article.title.toLowerCase();
    const summaryLower = article.summary?.toLowerCase() || '';
    
    // Check each category keyword for matches
    categories.forEach(category => {
      const categoryLower = category.toLowerCase();
      
      // Title matches are more valuable than summary matches
      if (titleLower.includes(categoryLower)) {
        relevanceScore += 2;
      }
      
      if (summaryLower.includes(categoryLower)) {
        relevanceScore += 1;
      }
      
      // Handle related terms for common financial categories
      const relatedTerms = getRelatedTerms(categoryLower);
      relatedTerms.forEach(term => {
        if (titleLower.includes(term)) relevanceScore += 1;
        if (summaryLower.includes(term)) relevanceScore += 0.5;
      });
    });
    
    return { article, relevanceScore };
  });
  
  // Filter articles that have at least some relevance
  const relevantArticles = articlesWithRelevance.filter(item => item.relevanceScore > 0);
  
  // Sort by relevance score (highest first) and extract just the articles
  return relevantArticles
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .map(item => item.article);
}

// Get related terms for common financial categories
function getRelatedTerms(category: string): string[] {
  switch (category) {
    case 'earnings':
      return ['revenue', 'profit', 'quarterly', 'eps', 'income', 'guidance', 'forecast'];
    case 'market':
      return ['stocks', 'trading', 'index', 'indices', 'dow', 'nasdaq', 'sp500', 'market'];
    case 'crypto':
      return ['bitcoin', 'ethereum', 'blockchain', 'token', 'cryptocurrency', 'crypto'];
    case 'tech':
      return ['technology', 'software', 'hardware', 'ai', 'artificial intelligence', 'cloud'];
    case 'economy':
      return ['fed', 'federal reserve', 'inflation', 'rates', 'economic', 'gdp', 'growth'];
    default:
      return [];
  }
}
