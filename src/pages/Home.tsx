
import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatPercent, getColorByChange } from '@/utils/formatters';
import { ArrowRight, Settings, Plus, Eye, Zap, Gift, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import StockChart from '@/components/ui/StockChart';
import NavigationBar from '@/components/layout/NavigationBar';
import Footer from '@/components/layout/Footer';
import { usePortfolio } from '@/hooks/usePortfolio';

// Interface definitions
interface WatchlistItem {
  symbol: string;
  price: number;
  change: number;
  type?: string;
  date?: string;
}

interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
}

const Home: React.FC = () => {
  const { portfolio, isLoading } = usePortfolio();
  
  // Mock data for demonstration
  const portfolioSummary = {
    value: 519.65,
    change: 32.46,
    changePercent: 6.25,
    buyingPower: 4.75
  };

  // Mock chart data
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 30 + i);
    return {
      date: date.toISOString().split('T')[0],
      price: 500 + Math.random() * 100
    };
  });

  // Mock stocks data
  const stocks = [
    { symbol: 'EXOD', name: 'Exodus Movement, Inc.', shares: 10, price: 46.80, change: -3.50 },
    { symbol: 'HOOD', name: 'Robinhood', price: 33.93, change: 3.76, type: 'call', date: '1/16/2026' }
  ];

  // Mock crypto data
  const cryptos = [
    { symbol: 'PEPE', name: 'Pepe', price: 0.00000724, change: -0.62, holdings: 6473553.00 }
  ];

  // Mock watchlists
  const watchlists: Watchlist[] = [
    { id: '1', name: 'Options Watchlist', items: [
      { symbol: 'HOOD', price: 33.93, change: 3.76, type: 'call', date: '1/16/2026' }
    ]},
    { id: '2', name: 'My First List', items: [
      { symbol: 'VTI', price: 277.00, change: -0.62 },
      { symbol: 'VPU', price: 171.72, change: 0.05 },
      { symbol: 'VOO', price: 516.68, change: -0.66 },
      { symbol: 'VYM', price: 128.50, change: -0.34 },
      { symbol: 'VGT', price: 561.00, change: -0.30 }
    ]}
  ];

  // Announcement data
  const announcement = {
    date: 'Mar 26',
    title: 'Robinhood announcement',
    content: 'You\'re invited to a livestream with CEO Vlad Tenev on March 26 at 6:30 PM PT/9:30 PM ET.'
  };

  // Mock trending lists
  const trendingLists = [
    { id: '1', name: 'Newly Listed Crypto', icon: '🔶' },
    { id: '2', name: 'Tradable Crypto', icon: '🔷' },
    { id: '3', name: 'IPO Access', icon: '🔘' },
    { id: '4', name: 'Algorize', icon: '🔮' },
    { id: '5', name: '100 Most Popular', icon: '📈' },
    { id: '6', name: 'Daily Movers', icon: '🔄' },
    { id: '7', name: 'Cannabis', icon: '🌿' },
    { id: '8', name: 'Upcoming Earnings', icon: '📊' },
    { id: '9', name: '24 Hour Market', icon: '🕓' },
    { id: '10', name: 'Tech, Media & Telecom', icon: '💻' },
    { id: '11', name: 'Technology', icon: '🔋' },
    { id: '12', name: 'ETFs', icon: '📃' }
  ];

  // Mock market indices
  const marketIndices = [
    { name: 'S&P 500', value: '5,667.56', change: '+0.08%', isPositive: true },
    { name: 'Nasdaq', value: '17,724.05', change: '+0.52%', isPositive: true },
    { name: 'Bitcoin', value: '$84,158.07', change: '+0.08%', isPositive: true }
  ];

  // Mock news articles
  const newsArticles = [
    {
      id: '1',
      source: "Investor's Guild",
      time: '3d',
      title: "Can Europe stay on this roll?",
      content: "The European stock rally has been driven by momentum and increased government spending.",
      imageUrl: "public/lovable-uploads/6c5291ac-254a-4ad0-9353-b735e57427df.png"
    },
    {
      id: '2',
      source: "The Motley Fool",
      time: '2h',
      title: "Could Netflix Stock Help You Retire a Millionaire?",
      content: "NFLX +0.91%",
      imageUrl: "public/lovable-uploads/28b9ab24-c539-4d97-bdf4-0c6621fe68b2.png"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <NavigationBar />
      <main className="flex-grow pt-6 pb-16">
        <div className="container mx-auto px-4">
          {/* Portfolio Summary */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold">Investing</h1>
              <button className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-1.5 rounded-full text-sm font-medium flex items-center">
                <Gift className="w-4 h-4 mr-1" /> Gold Month
              </button>
            </div>
            <div className="flex items-baseline mb-1">
              <h2 className="text-4xl font-bold mr-3">${portfolioSummary.value.toFixed(2)}</h2>
            </div>
            <div className={cn("flex items-center mb-6", 
              portfolioSummary.change >= 0 ? "text-green-500" : "text-red-500")}>
              <span className="flex items-center">
                {portfolioSummary.change >= 0 ? '▲' : '▼'} ${Math.abs(portfolioSummary.change).toFixed(2)} ({Math.abs(portfolioSummary.changePercent).toFixed(2)}%)
              </span>
              <span className="ml-1 text-gray-400">Today</span>
            </div>
            
            {/* Chart */}
            <div className="mb-6 h-64">
              <StockChart data={chartData} positiveChange={portfolioSummary.change >= 0} minimal={false} />
              
              <div className="flex mt-4 border-b border-gray-800 pb-2">
                <button className="px-4 py-1 text-green-500 border-b-2 border-green-500">1D</button>
                <button className="px-4 py-1 text-gray-400">1W</button>
                <button className="px-4 py-1 text-gray-400">1M</button>
                <button className="px-4 py-1 text-gray-400">3M</button>
                <button className="px-4 py-1 text-gray-400">YTD</button>
                <button className="px-4 py-1 text-gray-400">1Y</button>
                <button className="px-4 py-1 text-gray-400">ALL</button>
              </div>
            </div>
            
            {/* Buying Power */}
            <div className="flex justify-between items-center p-4 border border-gray-800 rounded-lg mb-6">
              <div className="flex items-center">
                <span className="font-medium mr-1">Buying power</span>
                <button className="text-gray-400">
                  <Info size={16} />
                </button>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">${portfolioSummary.buyingPower.toFixed(2)}</span>
                <button className="text-gray-400">
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
            
            {/* Gold Month Announcement */}
            <div className="flex p-4 border border-gray-800 rounded-lg mb-8 bg-gray-900">
              <div className="mr-4 bg-amber-500 text-center p-2 rounded-md w-16">
                <div className="text-lg font-bold text-black">Mar</div>
                <div className="text-2xl font-bold text-black">26</div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-200">{announcement.title}</h3>
                  <button className="text-gray-400">✕</button>
                </div>
                <p className="text-sm mt-1 text-gray-300">{announcement.content}</p>
                <button className="text-green-500 font-medium text-sm mt-2">Remind me</button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Cryptocurrency Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Cryptocurrencies</h2>
                <div className="space-y-3">
                  {cryptos.map((crypto) => (
                    <div key={crypto.symbol} className="flex justify-between items-center border-b border-gray-800 pb-3">
                      <div>
                        <div className="font-medium">{crypto.symbol}</div>
                        <div className="text-sm text-gray-400">{crypto.holdings.toLocaleString()}</div>
                      </div>
                      <div className="flex">
                        <div className="w-20 h-10">
                          <svg viewBox="0 0 100 30" width="100%" height="100%">
                            <path d="M0,15 L10,20 L20,5 L30,25 L40,10 L50,15 L60,5 L70,20 L80,10 L90,15 L100,5" 
                                  fill="none" 
                                  stroke={crypto.change >= 0 ? "#22c55e" : "#ef4444"} 
                                  strokeWidth="2" />
                          </svg>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-medium">${crypto.price.toFixed(8)}</div>
                          <div className={crypto.change >= 0 ? "text-green-500" : "text-red-500"}>
                            {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Stocks Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Stocks</h2>
                <div className="space-y-3">
                  {stocks.map((stock) => (
                    <div key={stock.symbol} className="flex justify-between items-center border-b border-gray-800 pb-3">
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-sm text-gray-400">
                          {stock.shares ? `${stock.shares} Shares` : (stock.type ? `${stock.date} • ${stock.type.charAt(0).toUpperCase() + stock.type.slice(1)}` : '')}
                        </div>
                      </div>
                      <div className="flex">
                        <div className="w-20 h-10">
                          <svg viewBox="0 0 100 30" width="100%" height="100%">
                            <path d="M0,15 L10,10 L20,20 L30,5 L40,15 L50,10 L60,20 L70,15 L80,5 L90,15 L100,10" 
                                  fill="none" 
                                  stroke={stock.change >= 0 ? "#22c55e" : "#ef4444"} 
                                  strokeWidth="2" />
                          </svg>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-medium">${stock.price.toFixed(2)}</div>
                          <div className={stock.change > 0 ? "text-green-500" : (stock.change < 0 ? "text-red-500" : "text-gray-500")}>
                            {stock.change > 0 ? '+' : ''}{stock.change}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Discover More Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    Discover more
                    <Info size={16} className="ml-2 text-gray-400" />
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border border-gray-800 rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="mb-3">🏆</div>
                    <h3 className="font-medium mb-1">1,000 gold bar giveaway</h3>
                    <p className="text-sm text-gray-400">Deposit with Robinhood Gold for a chance to win a real gold bar. No purchase necessary.</p>
                  </div>
                  
                  <div className="border border-gray-800 rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="mb-3">💸</div>
                    <h3 className="font-medium mb-1">2% transfer bonus</h3>
                    <p className="text-sm text-gray-400">Earn a 2% bonus on all eligible account transfers. Subscription and terms apply.</p>
                  </div>
                  
                  <div className="border border-gray-800 rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="mb-3">🪙</div>
                    <h3 className="font-medium mb-1">1% crypto deposit boost</h3>
                    <p className="text-sm text-gray-400">Earn a boost on all eligible crypto deposits. Subscription and terms apply.</p>
                  </div>
                </div>
              </div>
              
              {/* Trending Lists */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    Trending lists
                    <Info size={16} className="ml-2 text-gray-400" />
                  </h2>
                  <button className="text-sm text-green-500">Show More</button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {trendingLists.slice(0, 12).map(list => (
                    <div key={list.id} className="bg-gray-900 rounded-lg p-3 text-center hover:bg-gray-800 transition-colors">
                      <div className="text-xl mb-2">{list.icon}</div>
                      <div className="text-xs font-medium">{list.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* News Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4">News</h2>
                
                {/* Market Indices */}
                <div className="flex flex-wrap justify-between bg-gray-900 p-4 rounded-lg mb-6">
                  {marketIndices.map((index, i) => (
                    <div key={i} className="flex items-center">
                      <span className="font-medium mr-2">{index.name}</span>
                      <span className="mr-2">{index.value}</span>
                      <span className={index.isPositive ? "text-green-500" : "text-red-500"}>
                        {index.change}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* News Articles */}
                <div className="space-y-6">
                  {newsArticles.map(article => (
                    <div key={article.id} className="flex border-b border-gray-800 pb-6">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center text-sm text-gray-400 mb-2">
                          <span>{article.source}</span>
                          <span className="mx-2">•</span>
                          <span>{article.time}</span>
                        </div>
                        <h3 className="font-medium mb-2">{article.title}</h3>
                        <p className="text-sm text-gray-300">{article.content}</p>
                      </div>
                      <div className="w-1/3">
                        <img src={article.imageUrl} alt={article.title} className="rounded-lg h-24 w-full object-cover" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Watchlists */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Lists</h2>
                <button className="text-gray-400">
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {watchlists.map((list) => (
                  <div key={list.id} className="border border-gray-800 rounded-lg">
                    <div className="flex justify-between items-center p-3 border-b border-gray-800">
                      <div className="flex items-center">
                        {list.name === 'Options Watchlist' ? <Eye size={16} className="mr-2" /> : <Zap size={16} className="mr-2" />}
                        <span>{list.name}</span>
                      </div>
                      <button>
                        {list.items.length > 0 ? (
                          <ChevronDown size={16} />
                        ) : null}
                      </button>
                    </div>
                    
                    {list.items.slice(0, 5).map((item, index) => (
                      <div key={`${item.symbol}-${index}`} className="flex justify-between items-center p-3 border-b border-gray-800">
                        <div>
                          <div className="font-medium">{item.symbol}</div>
                          <div className="text-sm text-gray-400">
                            {item.type ? `${item.date} • ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}` : ''}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${item.price.toFixed(2)}</div>
                          <div className={item.change > 0 ? "text-green-500" : (item.change < 0 ? "text-red-500" : "text-gray-500")}>
                            {item.change > 0 ? '+' : ''}{item.change}%
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Pagination indicator */}
                    <div className="flex justify-center items-center p-2 text-sm text-gray-400">
                      <button className="mx-1">
                        <ChevronUp size={16} />
                      </button>
                      <span>1 of {list.items.length}</span>
                      <button className="mx-1">
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
