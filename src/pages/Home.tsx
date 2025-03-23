
import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatPercent, getColorByChange } from '@/utils/formatters';
import { ArrowRight, Settings, Plus, Eye, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import StockChart from '@/components/ui/StockChart';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { usePortfolio } from '@/hooks/usePortfolio';

// Define a proper interface for watchlist items
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
    value: 557.55,
    change: 18.57,
    changePercent: 3.44,
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
    { symbol: 'EXOD', name: 'Exodus', shares: 10, price: 50.60, change: 4.31 },
    { symbol: 'HOOD', name: 'Robinhood', price: 33.93, change: 0.00, type: 'call', date: '1/16/2026' },
    { symbol: 'VTI', name: 'Vanguard Total Stock', price: 277.00, change: -0.62 },
    { symbol: 'VPU', name: 'Vanguard Utilities', price: 171.72, change: 0.05 },
    { symbol: 'VOO', name: 'Vanguard S&P 500', price: 516.68, change: -0.66 },
    { symbol: 'VYM', name: 'Vanguard High Dividend', price: 128.50, change: -0.34 },
    { symbol: 'VGT', name: 'Vanguard Information Tech', price: 561.00, change: -0.30 }
  ];

  // Mock crypto data
  const cryptos = [
    { symbol: 'PEPE', name: 'Pepe', price: 0.00000723, change: -4.55, holdings: 6473553.00 }
  ];

  // Mock lists with properly typed items
  const watchlists: Watchlist[] = [
    { id: '1', name: 'Options Watchlist', items: [
      { symbol: 'HOOD', price: 33.93, change: 0.00, type: 'call', date: '1/16/2026' }
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Portfolio Summary */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold">Investing</h1>
              <button className="bg-amber-300 hover:bg-amber-400 text-black px-4 py-1.5 rounded-full text-sm font-medium flex items-center">
                <span className="mr-1">🎁</span> Gold Month
              </button>
            </div>
            <div className="flex items-baseline mb-1">
              <h2 className="text-4xl font-bold mr-3">{formatCurrency(portfolioSummary.value)}</h2>
            </div>
            <div className={cn("flex items-center mb-8", portfolioSummary.change >= 0 ? "text-green-500" : "text-red-500")}>
              <span className="flex items-center">
                {portfolioSummary.change >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(portfolioSummary.change))} ({formatPercent(Math.abs(portfolioSummary.changePercent))})
              </span>
              <span className="ml-1 text-muted-foreground">Today</span>
            </div>
            
            {/* Chart */}
            <div className="mb-8 h-64">
              <StockChart data={chartData} positiveChange={portfolioSummary.change >= 0} minimal={false} />
              
              <div className="flex mt-4 border-b border-border pb-2">
                <button className="px-4 py-1 text-primary border-b-2 border-primary">1D</button>
                <button className="px-4 py-1 text-muted-foreground">1W</button>
                <button className="px-4 py-1 text-muted-foreground">1M</button>
                <button className="px-4 py-1 text-muted-foreground">3M</button>
                <button className="px-4 py-1 text-muted-foreground">YTD</button>
                <button className="px-4 py-1 text-muted-foreground">1Y</button>
                <button className="px-4 py-1 text-muted-foreground">ALL</button>
              </div>
            </div>
            
            {/* Buying Power */}
            <div className="flex justify-between items-center p-4 border border-border rounded-lg mb-8">
              <div className="flex items-center">
                <span className="font-medium mr-1">Buying power</span>
                <button className="text-muted-foreground">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                  </svg>
                </button>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">{formatCurrency(portfolioSummary.buyingPower)}</span>
                <button className="text-muted-foreground">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Announcement */}
            <div className="flex p-4 border border-border rounded-lg mb-8 bg-amber-50">
              <div className="mr-4 bg-amber-200 text-center p-2 rounded-md w-16">
                <div className="text-lg font-bold">Mar</div>
                <div className="text-2xl font-bold">26</div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-600">{announcement.title}</h3>
                  <button className="text-gray-400">✕</button>
                </div>
                <p className="text-sm mt-1">{announcement.content}</p>
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
                    <div key={crypto.symbol} className="flex justify-between items-center border-b border-border pb-3">
                      <div>
                        <div className="font-medium">{crypto.symbol}</div>
                        <div className="text-sm text-muted-foreground">{crypto.holdings.toLocaleString()}</div>
                      </div>
                      <div className="flex">
                        <div className="w-20 h-10">
                          <svg viewBox="0 0 100 30" width="100%" height="100%">
                            <path d="M0,15 L10,20 L20,5 L30,25 L40,10 L50,15 L60,5 L70,20 L80,10 L90,15 L100,5" 
                                  fill="none" 
                                  stroke={crypto.change >= 0 ? "green" : "red"} 
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
                  {stocks.slice(0, 2).map((stock) => (
                    <div key={stock.symbol} className="flex justify-between items-center border-b border-border pb-3">
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {stock.shares ? `${stock.shares} Shares` : (stock.type ? `${stock.date} • ${stock.type.charAt(0).toUpperCase() + stock.type.slice(1)}` : '')}
                        </div>
                      </div>
                      <div className="flex">
                        <div className="w-20 h-10">
                          <svg viewBox="0 0 100 30" width="100%" height="100%">
                            <path d="M0,15 L10,10 L20,20 L30,5 L40,15 L50,10 L60,20 L70,15 L80,5 L90,15 L100,10" 
                                  fill="none" 
                                  stroke={stock.change >= 0 ? "green" : "red"} 
                                  strokeWidth="2" />
                          </svg>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-medium">${stock.price.toFixed(2)}</div>
                          <div className={stock.change > 0 ? "text-green-500" : (stock.change < 0 ? "text-red-500" : "text-gray-500")}>
                            {stock.change > 0 ? '+' : (stock.change < 0 ? '' : '')}{stock.change}%
                          </div>
                        </div>
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
                  <div key={list.id} className="border border-border rounded-lg">
                    <div className="flex justify-between items-center p-3 border-b border-border">
                      <div className="flex items-center">
                        {list.name === 'Options Watchlist' ? <Eye size={16} className="mr-2" /> : <Zap size={16} className="mr-2" />}
                        <span>{list.name}</span>
                      </div>
                      <button>
                        {list.items.length > 0 ? (
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M7 10l5 5 5-5z"></path>
                          </svg>
                        ) : null}
                      </button>
                    </div>
                    
                    {list.items.slice(0, 1).map((item) => (
                      <div key={item.symbol} className="flex justify-between items-center p-3 border-b border-border">
                        <div>
                          <div className="font-medium">{item.symbol}</div>
                          <div className="text-sm text-muted-foreground">
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
                    <div className="flex justify-center items-center p-2 text-sm text-muted-foreground">
                      <button className="mx-1">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                        </svg>
                      </button>
                      <span>1 of {list.items.length}</span>
                      <button className="mx-1">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                        </svg>
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

