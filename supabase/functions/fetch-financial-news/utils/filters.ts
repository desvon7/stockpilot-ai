
import { NewsItem } from "../types.ts";

// Filter news by categories if specified
export function filterNewsByCategories(news: NewsItem[], categories?: string[]): NewsItem[] {
  if (!categories || categories.length === 0) {
    return news;
  }
  
  return news.filter(article => {
    return categories.some(category => 
      article.title.toLowerCase().includes(category.toLowerCase()) ||
      article.summary.toLowerCase().includes(category.toLowerCase())
    );
  });
}
