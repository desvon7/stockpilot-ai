
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate mock news when API keys aren't available or for testing
function generateMockNews(symbols = [], categories = [], limit = 30) {
  const companies = {
    'AAPL': 'Apple',
    'MSFT': 'Microsoft',
    'GOOGL': 'Google',
    'AMZN': 'Amazon',
    'META': 'Meta',
    'TSLA': 'Tesla',
    'NVDA': 'NVIDIA',
    'BRK.B': 'Berkshire Hathaway',
    'JPM': 'JPMorgan Chase',
    'BAC': 'Bank of America',
  };
  
  const stockNames = symbols.map(symbol => companies[symbol] || symbol);
  
  const mockNews = [];
  const sources = ['Bloomberg', 'Reuters', 'CNBC', 'Financial Times', 'Wall Street Journal'];
  const mockTopics = [
    { title: 'Earnings Report', sentiment: 0.7 },
    { title: 'Stock Downgrade', sentiment: -0.6 },
    { title: 'New Product Launch', sentiment: 0.8 },
    { title: 'CEO Resigns', sentiment: -0.5 },
    { title: 'Dividend Increase', sentiment: 0.6 },
    { title: 'Market Analysis', sentiment: 0.2 },
    { title: 'Stock Upgrade', sentiment: 0.7 },
    { title: 'Quarterly Results', sentiment: 0.5 },
    { title: 'Industry Outlook', sentiment: 0.3 },
    { title: 'Acquisition News', sentiment: 0.4 },
    { title: 'Market Volatility', sentiment: -0.3 },
    { title: 'Fed Rate Decision', sentiment: 0.1 },
  ];
  
  // Generate news for each category or general financial news
  let newsCount = 0;
  const targetCompanies = stockNames.length > 0 ? stockNames : ['the market', 'Wall Street', 'investors', 'the economy'];
  
  while (newsCount < limit) {
    const randomCompanyIndex = Math.floor(Math.random() * targetCompanies.length);
    const company = targetCompanies[randomCompanyIndex];
    
    const randomTopicIndex = Math.floor(Math.random() * mockTopics.length);
    const topic = mockTopics[randomTopicIndex];
    
    const randomSourceIndex = Math.floor(Math.random() * sources.length);
    const source = sources[randomSourceIndex];
    
    const daysAgo = Math.floor(Math.random() * 7); // 0-6 days ago
    const hoursAgo = Math.floor(Math.random() * 24); // 0-23 hours ago
    const publishedDate = new Date();
    publishedDate.setDate(publishedDate.getDate() - daysAgo);
    publishedDate.setHours(publishedDate.getHours() - hoursAgo);
    
    // Generate a title based on sentiment
    let title = '';
    let summary = '';
    
    if (symbols.length > 0) {
      // Company-specific news
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const companyName = companies[symbol] || symbol;
      
      if (topic.sentiment > 0) {
        title = `${companyName} ${['Surges', 'Gains', 'Climbs', 'Beats Expectations', 'Outperforms'][Math.floor(Math.random() * 5)]} on ${topic.title}`;
        summary = `${companyName} stock ${['rose', 'increased', 'jumped', 'climbed', 'rallied'][Math.floor(Math.random() * 5)]} after the company announced ${['better-than-expected', 'strong', 'positive', 'impressive'][Math.floor(Math.random() * 4)]} ${['quarterly results', 'earnings', 'growth', 'performance'][Math.floor(Math.random() * 4)]}.`;
      } else {
        title = `${companyName} ${['Drops', 'Falls', 'Declines', 'Misses Expectations', 'Struggles'][Math.floor(Math.random() * 5)]} on ${topic.title}`;
        summary = `${companyName} stock ${['fell', 'decreased', 'dropped', 'declined', 'slipped'][Math.floor(Math.random() * 5)]} after the company announced ${['disappointing', 'weak', 'concerning', 'lower-than-expected'][Math.floor(Math.random() * 4)]} ${['quarterly results', 'earnings', 'guidance', 'outlook'][Math.floor(Math.random() * 4)]}.`;
      }
    } else {
      // General market news
      if (Math.random() > 0.5) {
        title = `${categories.length > 0 ? categories[0].charAt(0).toUpperCase() + categories[0].slice(1) + ':' : ''} ${['Markets', 'Stocks', 'Investors', 'Wall Street', 'S&P 500'][Math.floor(Math.random() * 5)]} ${['Rise', 'Gain', 'Advance', 'Rally', 'Climb'][Math.floor(Math.random() * 5)]} Amid ${topic.title}`;
        summary = `${['Markets', 'Stocks', 'Indices', 'Equities'][Math.floor(Math.random() * 4)]} ${['gained', 'advanced', 'rose', 'climbed', 'moved higher'][Math.floor(Math.random() * 5)]} as ${['investors', 'traders', 'market participants'][Math.floor(Math.random() * 3)]} ${['reacted to', 'digested', 'assessed', 'weighed'][Math.floor(Math.random() * 4)]} ${topic.title.toLowerCase()}.`;
      } else {
        title = `${categories.length > 0 ? categories[0].charAt(0).toUpperCase() + categories[0].slice(1) + ':' : ''} ${['Markets', 'Stocks', 'Investors', 'Wall Street', 'S&P 500'][Math.floor(Math.random() * 5)]} ${['Fall', 'Decline', 'Retreat', 'Drop', 'Slip'][Math.floor(Math.random() * 5)]} Amid ${topic.title}`;
        summary = `${['Markets', 'Stocks', 'Indices', 'Equities'][Math.floor(Math.random() * 4)]} ${['fell', 'declined', 'dropped', 'retreated', 'moved lower'][Math.floor(Math.random() * 5)]} as ${['investors', 'traders', 'market participants'][Math.floor(Math.random() * 3)]} ${['reacted to', 'digested', 'assessed', 'weighed'][Math.floor(Math.random() * 4)]} ${topic.title.toLowerCase()}.`;
      }
    }
    
    mockNews.push({
      id: `mock-${newsCount}-${Date.now()}`,
      title,
      summary,
      source,
      publishedAt: publishedDate.toISOString(),
      url: 'https://example.com/news',
      imageUrl: `https://picsum.photos/seed/${newsCount}/640/360`,
      symbols: symbols.length > 0 ? [symbols[Math.floor(Math.random() * symbols.length)]] : [],
      categories: categories.length > 0 ? [categories[Math.floor(Math.random() * categories.length)]] : ['general'],
      sentiment: topic.sentiment,
      provider: 'mock'
    });
    
    newsCount++;
  }
  
  return mockNews;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols = [], categories = ['general'], limit = 30 } = await req.json();
    
    // Make sure symbols is an array
    const symbolsArray = Array.isArray(symbols) ? symbols : [symbols].filter(Boolean);
    const categoriesArray = Array.isArray(categories) ? categories : [categories].filter(Boolean);
    
    console.log(`Fetching news for symbols: [${symbolsArray.join(', ')}], categories: [${categoriesArray.join(', ')}]`);
    
    // Generate mock news since we don't have API keys configured
    const mockNews = generateMockNews(symbolsArray, categoriesArray, limit);
    
    console.log(`Returning ${mockNews.length} mock news items`);
    
    const sources = [...new Set(mockNews.map(item => item.source))];
    
    return new Response(JSON.stringify({
      news: mockNews,
      sources,
      mock: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-financial-news function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to fetch news',
      news: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
