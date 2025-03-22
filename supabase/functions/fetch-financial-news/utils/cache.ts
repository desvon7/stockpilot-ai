
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
    
    // Cache key is more specific now with both symbols and categories
    const cacheKey = `${symbols.sort().join(',')}_${categories?.sort().join(',') || 'all'}`;
    console.log('Using cache key:', cacheKey);
    
    // More targeted cache query
    const { data, error } = await supabaseAdmin
      .from('news_cache')
      .select('news, fetched_at, expires_at')
      .contains('symbols', symbols)
      .lt('expires_at', new Date().toISOString())
      .order('fetched_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking news cache:', error);
      return null;
    }
    
    if (data) {
      const cacheAge = new Date().getTime() - new Date(data.fetched_at).getTime();
      const cacheAgeMinutes = Math.floor(cacheAge / 60000);
      console.log(`Found cached news from ${data.fetched_at} (${cacheAgeMinutes} minutes old)`);
      return data.news;
    }
    
    console.log('No suitable cache found');
    return null;
  } catch (error) {
    console.error('Failed to check cache:', error);
    return null;
  }
}

// Save news to cache for future use with improved expiry
export async function saveNewsToCache(news: NewsItem[], symbols: string[], categories?: string[]): Promise<void> {
  try {
    if (news.length === 0) {
      console.log('No news to cache');
      return;
    }
    
    console.log(`Caching ${news.length} news items for symbols: ${symbols.join(',')}`);
    
    // Calculate appropriate cache expiry based on number of items
    // More items = longer cache time as it's likely better quality data
    const expiryHours = Math.min(3, Math.max(1, Math.ceil(news.length / 10)));
    const expiryTime = new Date(Date.now() + expiryHours * 60 * 60 * 1000);
    
    console.log(`Setting cache expiry for ${expiryHours} hours (until ${expiryTime.toISOString()})`);
    
    const { error } = await supabaseAdmin
      .from('news_cache')
      .insert({
        symbols,
        category: categories && categories.length > 0 ? categories[0] : null,
        news,
        fetched_at: new Date().toISOString(),
        expires_at: expiryTime.toISOString()
      });
    
    if (error) {
      console.error('Error saving to news cache:', error);
    } else {
      console.log('Successfully cached news data');
    }
  } catch (error) {
    console.error('Failed to save news to cache:', error);
  }
}
