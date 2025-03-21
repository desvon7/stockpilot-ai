
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Info, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent, getColorByChange, getBgColorByChange, getArrowByChange } from '@/utils/formatters';

interface AssetCategory {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
}

interface AssetItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  categoryId: string;
}

const TrendingAssets: React.FC = () => {
  const categories: AssetCategory[] = [
    { id: 'crypto', name: 'Newly Listed Crypto', icon: '💜', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
    { id: 'tradable-crypto', name: 'Tradable Crypto', icon: '🔵', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { id: 'ipo', name: 'IPO Access', icon: '🌱', bgColor: 'bg-green-100 dark:bg-green-900/20' },
    { id: 'altcoins', name: 'Altcoins', icon: '🔮', bgColor: 'bg-indigo-100 dark:bg-indigo-900/20' },
    { id: 'popular', name: '100 Most Popular', icon: '🔴', bgColor: 'bg-red-100 dark:bg-red-900/20' },
    { id: 'movers', name: 'Daily Movers', icon: '🧡', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
    { id: 'cannabis', name: 'Cannabis', icon: '🌿', bgColor: 'bg-green-100 dark:bg-green-900/20' },
    { id: 'earnings', name: 'Upcoming Earnings', icon: '💛', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { id: 'market', name: '24 Hour Market', icon: '🔵', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { id: 'tech', name: 'Tech, Media, & Telecom', icon: '🔷', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { id: 'technology', name: 'Technology', icon: '🔵', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { id: 'etfs', name: 'ETFs', icon: '💚', bgColor: 'bg-green-100 dark:bg-green-900/20' },
    { id: 'energy', name: 'Energy', icon: '💙', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { id: 'pharma', name: 'Pharma', icon: '🧡', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
    { id: 'growth', name: 'Growth & Value ETFs', icon: '💚', bgColor: 'bg-green-100 dark:bg-green-900/20' },
    { id: 'energy-water', name: 'Energy & Water', icon: '💧', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { id: 'healthcare', name: 'Healthcare', icon: '🧡', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
    { id: 'consumer', name: 'Consumer Goods', icon: '🟤', bgColor: 'bg-amber-100 dark:bg-amber-900/20' },
    { id: 'realestate', name: 'Real Estate', icon: '💚', bgColor: 'bg-green-100 dark:bg-green-900/20' },
    { id: 'business', name: 'Business', icon: '💙', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { id: 'software', name: 'Software', icon: '💙', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
  ];

  const assetItems: AssetItem[] = [
    { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 83670.30, change: -745.63, changePercent: -0.89, categoryId: 'crypto' },
    { id: '2', symbol: 'ETH', name: 'Ethereum', price: 3578.42, change: 15.63, changePercent: 0.44, categoryId: 'crypto' },
    { id: '3', symbol: 'SOL', name: 'Solana', price: 168.79, change: -3.21, changePercent: -1.86, categoryId: 'crypto' },
    { id: '4', symbol: 'AAPL', name: 'Apple Inc.', price: 187.68, change: 1.84, changePercent: 0.99, categoryId: 'popular' },
    { id: '5', symbol: 'MSFT', name: 'Microsoft Corp.', price: 412.66, change: 2.41, changePercent: 0.59, categoryId: 'popular' },
    { id: '6', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 152.16, change: -0.74, changePercent: -0.48, categoryId: 'popular' },
    { id: '7', symbol: 'TSLA', name: 'Tesla, Inc.', price: 174.88, change: -3.92, changePercent: -2.19, categoryId: 'movers' },
    { id: '8', symbol: 'NVDA', name: 'NVIDIA Corp.', price: 893.45, change: 11.23, changePercent: 1.27, categoryId: 'movers' },
    { id: '9', symbol: 'F', name: 'Ford Motor Co.', price: 12.43, change: -0.10, changePercent: -0.80, categoryId: 'movers' },
  ];

  return (
    <>
      <Helmet>
        <title>Trending Assets | StockPilot</title>
      </Helmet>
      
      <div className="container mx-auto px-4 pt-24 pb-16 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Trending Assets</h1>
            <button className="text-muted-foreground hover:text-foreground">
              <Info size={18} />
            </button>
          </div>
          <Link to="/watchlists" className="text-primary hover:underline flex items-center text-sm">
            Show More
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-12">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/trending-assets/category/${category.id}`}
              className={cn(
                "flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-xl transition-transform hover:scale-105",
                category.bgColor
              )}
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-xs font-medium text-center line-clamp-2">{category.name}</span>
            </Link>
          ))}
        </div>
        
        <div className="mb-12">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="text-left px-6 py-3 text-sm font-medium">Symbol</th>
                      <th className="text-left px-6 py-3 text-sm font-medium">Name</th>
                      <th className="text-right px-6 py-3 text-sm font-medium">Price</th>
                      <th className="text-right px-6 py-3 text-sm font-medium">24h Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {assetItems.map((asset) => (
                      <tr 
                        key={asset.id} 
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link 
                            to={`/stocks/${asset.symbol}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {asset.symbol}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                          {asset.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                          {formatCurrency(asset.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={cn(
                            'inline-flex items-center px-2 py-1 rounded-md text-sm',
                            getBgColorByChange(asset.change),
                            getColorByChange(asset.change)
                          )}>
                            {getArrowByChange(asset.change)} {formatPercent(Math.abs(asset.changePercent))}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">S&P 500</div>
              <div className="text-lg font-semibold">5,662.89</div>
              <div className={cn("text-sm", getColorByChange(-0.22))}>
                {getArrowByChange(-0.22)} 0.22%
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">Nasdaq</div>
              <div className="text-lg font-semibold">17,691.63</div>
              <div className={cn("text-sm", getColorByChange(-0.33))}>
                {getArrowByChange(-0.33)} 0.33%
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">Bitcoin</div>
              <div className="text-lg font-semibold">$83,670.30</div>
              <div className={cn("text-sm", getColorByChange(-0.89))}>
                {getArrowByChange(-0.89)} 0.89%
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrendingAssets;
