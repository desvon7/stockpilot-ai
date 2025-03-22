
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { NewsItem } from "../types.ts";

// Initialize admin Supabase client
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Check if we have cached news first
export async function getNewsFromCache(symbols: string[], categories?: string[]): Promise<NewsItem[] | null> {
  try {
    console.log('Checking news cache for symbols:', symbols);
    
    // Basic query for cache
    let query = supabaseAdmin
      .from('news_cache')
      .select('news, fetched_at')
      .lt('expires_at', new Date().toISOString());
    
    // If we have symbols, add them to the query
    if (symbols && symbols.length > 0) {
      query = query.contains('symbols', symbols);
    }
    
    // If we have categories, add them to the query
    if (categories && categories.length > 0) {
      query = query.eq('category', categories[0]); // For simplicity, use first category
    }
    
    const { data, error } = await query.order('fetched_at', { ascending: false }).limit(1).maybeSingle();
    
    if (error) {
      console.error('Error checking news cache:', error);
      return null;
    }
    
    if (data) {
      console.log(`Found cached news from ${data.fetched_at}`);
      return data.news;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to check cache:', error);
    return null;
  }
}

// Save news to cache for future use
export async function saveNewsToCache(news: NewsItem[], symbols: string[], categories?: string[]): Promise<void> {
  try {
    if (news.length === 0) {
      console.log('No news to cache');
      return;
    }
    
    console.log(`Caching ${news.length} news items`);
    
    const { error } = await supabaseAdmin
      .from('news_cache')
      .insert({
        symbols,
        category: categories && categories.length > 0 ? categories[0] : null,
        news,
        fetched_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour expiry
      });
    
    if (error) {
      console.error('Error saving to news cache:', error);
    }
  } catch (error) {
    console.error('Failed to save news to cache:', error);
  }
}
