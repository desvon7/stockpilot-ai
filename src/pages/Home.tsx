
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  ChevronRight, 
  ChevronLeft, 
  Building, 
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  X,
  Plus 
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState('holdings');
  
  // Mock portfolio value
  const portfolioValue = 519.65;
  const dailyChange = 12.46;
  const dailyChangePercent = 2.52;

  // Mock data for charts and tables
  const mockStocks = [
    { symbol: 'EXOD', name: 'Exodus Movement, Inc.', shares: 10, price: 46.80, dailyChange: 3.5 },
  ];

  const mockCrypto = [
    { symbol: 'PEPE', name: 'Pepe', quantity: '6,473,553.00', price: 0.00000724, dailyChange: -0.82 },
  ];

  const mockWatchlist = [
    { symbol: 'HOOD', name: 'Hood $10 Call', expiryDate: '1/19/2024', type: 'buy', price: 35.20, dailyChange: 3.74 },
    { symbol: 'VTI', name: 'VTI', price: 278.78, dailyChange: 0.01 },
    { symbol: 'VPU', name: 'VPU', price: 170.46, dailyChange: -0.69 },
    { symbol: 'VOO', name: 'VOO', price: 453.72, dailyChange: 0.11 },
    { symbol: 'VYM', name: 'VYM', price: 128.34, dailyChange: -0.54 },
    { symbol: 'VGT', name: 'VGT', price: 566.00, dailyChange: 0.56 },
  ];

  const trendingLists = [
    { name: 'Newly Listed Crypto', icon: '🔥' },
    { name: 'Tradable Crypto', icon: '💰' },
    { name: 'IPO Access', icon: '🚀' },
    { name: 'Altcoins', icon: '🪙' },
    { name: '100 Most Popular', icon: '📈' },
    { name: 'Daily Movers', icon: '🔄' },
    { name: 'Cannabis', icon: '🌿' },
    { name: 'Upcoming Earnings', icon: '📅' },
    { name: '24 Hour Market', icon: '🕒' },
    { name: 'Tech, Media & Telecom', icon: '📱' },
    { name: 'Technology', icon: '💻' },
    { name: 'ETFs', icon: '📊' },
  ];

  const news = [
    {
      title: "Can Europe stay on this roll?",
      subtitle: "The European stock rally has been driven by momentum and increased government spending.",
      source: "Investor's Guild",
      time: "3d"
    },
    {
      title: "Could Netflix Stock Help You Retire a Millionaire?",
      source: "The Motley Fool",
      time: "2d"
    }
  ];

  const marketIndices = [
    { name: 'S&P 500', value: '5,667.56', change: '+0.08%' },
    { name: 'Nasdaq', value: '17,764.05', change: '+0.52%' },
    { name: 'Bitcoin', value: '$84,158.07', change: '+0.08%' }
  ];

  return (
    <>
      <Helmet>
        <title>Home | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="border-b border-border pb-6 mb-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-1">Investing</h1>
            <h2 className="text-4xl font-bold mb-2">${formatCurrency(portfolioValue)}</h2>
            <div className="flex items-center text-green-500">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span>${formatCurrency(dailyChange)} ({dailyChangePercent}%) Today</span>
            </div>
          </div>
          
          <div className="h-32 mt-4 bg-gradient-to-r from-transparent to-transparent relative">
            {/* This would be replaced with an actual chart component */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <svg viewBox="0 0 100 30" className="w-full h-full">
                <path
                  d="M0,15 C20,10 40,20 60,5 C80,15 100,10 100,15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4 overflow-x-auto">
            <button className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">LIVE</button>
            <button className="bg-muted px-3 py-1 rounded-full text-xs font-medium">1D</button>
            <button className="bg-muted px-3 py-1 rounded-full text-xs font-medium">1W</button>
            <button className="bg-muted px-3 py-1 rounded-full text-xs font-medium">1M</button>
            <button className="bg-muted px-3 py-1 rounded-full text-xs font-medium">3M</button>
            <button className="bg-muted px-3 py-1 rounded-full text-xs font-medium">YTD</button>
            <button className="bg-muted px-3 py-1 rounded-full text-xs font-medium">1Y</button>
            <button className="bg-muted px-3 py-1 rounded-full text-xs font-medium">ALL</button>
          </div>
        </div>
        
        <div className="mb-6">
          <Card className="bg-muted relative overflow-hidden mb-6">
            <button className="absolute top-2 right-2 p-1 rounded-full bg-background/60 hover:bg-background/80">
              <X className="h-4 w-4" />
            </button>
            <CardContent className="p-6 flex gap-4">
              <div className="rounded-full bg-background/80 p-2 self-start mt-1">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
                  <path d="M25 40L15 25L25 10L35 25L25 40Z" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-amber-500 mb-1">Gold Month</h3>
                <p className="text-sm mb-2">A new offer is on the block. See what's in the vault. Subscription and terms apply.</p>
                <Button variant="link" className="p-0 h-auto text-amber-500">Reveal new offer</Button>
              </div>
            </CardContent>
          </Card>
          
          <h2 className="text-xl font-bold flex items-center mb-4">
            Discover more
            <Button variant="ghost" size="icon" className="ml-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 relative">
            <Card className="bg-background p-4 flex flex-col items-center text-center">
              <div className="mb-2">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="60" rx="4" fill="#D4AF37" fillOpacity="0.1"/>
                  <rect x="10" y="10" width="40" height="40" rx="2" fill="#D4AF37" fillOpacity="0.2"/>
                  <rect x="20" y="20" width="20" height="20" rx="1" fill="#D4AF37"/>
                </svg>
              </div>
              <h3 className="text-sm font-medium mb-1">1,000 gold bar giveaway</h3>
              <p className="text-xs text-muted-foreground">Deposit with Robinhood Gold for a chance to win a real gold bar. No purchase necessary.</p>
            </Card>
            
            <Card className="bg-background p-4 flex flex-col items-center text-center">
              <div className="mb-2">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="60" rx="4" fill="#D4AF37" fillOpacity="0.1"/>
                  <path d="M30 15L45 40H15L30 15Z" fill="#D4AF37"/>
                </svg>
              </div>
              <h3 className="text-sm font-medium mb-1">2% transfer bonus</h3>
              <p className="text-xs text-muted-foreground">Earn a 2% bonus on all eligible account transfers. Subscription and terms apply</p>
            </Card>
            
            <Card className="bg-background p-4 flex flex-col items-center text-center">
              <div className="mb-2">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="60" rx="4" fill="#D4AF37" fillOpacity="0.1"/>
                  <circle cx="30" cy="30" r="15" fill="#D4AF37"/>
                </svg>
              </div>
              <h3 className="text-sm font-medium mb-1">1% crypto deposit boost</h3>
              <p className="text-xs text-muted-foreground">Earn a boost on all eligible crypto deposits. Subscription and terms apply.</p>
            </Card>
            
            <Card className="bg-background p-4 flex flex-col items-center text-center">
              <div className="mb-2">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="60" rx="4" fill="#D4AF37" fillOpacity="0.1"/>
                  <text x="30" y="35" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#D4AF37">4.5% APY</text>
                </svg>
              </div>
              <h3 className="text-sm font-medium mb-1">4.5% APY with Gold</h3>
              <p className="text-xs text-muted-foreground">Boost your rate on uninvested cash</p>
            </Card>
            
            <Card className="bg-background p-4 flex flex-col items-center text-center">
              <div className="mb-2">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="60" rx="4" fill="#D4AF37" fillOpacity="0.1"/>
                  <circle cx="30" cy="30" r="15" stroke="#D4AF37" strokeWidth="2"/>
                  <path d="M30 15C38.2843 15 45 21.7157 45 30" stroke="#D4AF37" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-sm font-medium mb-1">Retirement</h3>
              <p className="text-xs text-muted-foreground">Earn up to 2% on IRA transfers till April 30</p>
            </Card>
            
            <Button variant="ghost" size="icon" className="absolute -right-12 top-1/2 transform -translate-y-1/2 hidden md:flex">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        <div className="mb-10">
          <h2 className="text-xl font-bold flex items-center mb-4">
            Trending lists
            <Button variant="ghost" size="icon" className="ml-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </h2>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {trendingLists.slice(0, 6).map((list, index) => (
              <Button key={index} variant="outline" className="rounded-full flex items-center gap-2 h-auto py-2">
                <span>{list.icon}</span>
                <span>{list.name}</span>
              </Button>
            ))}
            <Button variant="link" className="text-primary">Show More</Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {trendingLists.slice(6, 12).map((list, index) => (
              <Button key={index} variant="outline" className="rounded-full flex items-center gap-2 h-auto py-2">
                <span>{list.icon}</span>
                <span>{list.name}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold flex items-center mb-4">
            News
            <Button variant="ghost" size="icon" className="ml-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </h2>
          
          <Card className="bg-background mb-4">
            <div className="flex gap-4 p-4">
              <div className="flex-1 space-y-1">
                <div className="text-xs text-muted-foreground flex items-center mb-1">
                  <span>{news[0].source}</span>
                  <span className="mx-1">•</span>
                  <span>{news[0].time}</span>
                </div>
                <h3 className="font-medium">{news[0].title}</h3>
                <p className="text-sm text-muted-foreground">{news[0].subtitle}</p>
              </div>
              <div className="w-32 h-24 bg-muted rounded-md shrink-0"></div>
            </div>
          </Card>
          
          <Card className="bg-background mb-6">
            <div className="flex gap-4 p-4">
              <div className="flex-1 space-y-1">
                <div className="text-xs text-muted-foreground flex items-center mb-1">
                  <span>{news[1].source}</span>
                  <span className="mx-1">•</span>
                  <span>{news[1].time}</span>
                </div>
                <h3 className="font-medium">{news[1].title}</h3>
              </div>
              <div className="w-32 h-24 bg-muted rounded-md shrink-0"></div>
            </div>
          </Card>
          
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            {marketIndices.map((index, i) => (
              <div key={i} className="space-y-1">
                <div className="text-xs text-muted-foreground">{index.name}</div>
                <div className="font-medium">{index.value}</div>
                <div className={`text-xs ${index.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {index.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AccountLayout>
    </>
  );
};

export default Home;
