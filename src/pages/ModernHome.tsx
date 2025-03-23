
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowRight, 
  TrendingUp, 
  ChevronRight, 
  BarChart2, 
  Briefcase, 
  Shield, 
  Zap, 
  Search,
  Globe,
  LineChart,
  Layers,
  Clock,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MainNavigationBar from '@/components/layout/MainNavigationBar';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

const features = [
  {
    title: 'Advanced Analytics',
    description: 'AI-powered market analysis and investment recommendations tailored to your goals',
    icon: <LineChart className="h-5 w-5 text-primary" />
  },
  {
    title: 'Commission-Free Trading',
    description: 'Trade U.S. stocks and ETFs without paying commissions or fees',
    icon: <Zap className="h-5 w-5 text-primary" />
  },
  {
    title: 'Portfolio Diversification',
    description: 'Smart allocation suggestions to optimize your investment strategy',
    icon: <Layers className="h-5 w-5 text-primary" />
  },
  {
    title: 'Real-Time Data',
    description: 'Streaming market data and instant execution for time-sensitive trades',
    icon: <Clock className="h-5 w-5 text-primary" />
  },
];

const marketIndices = [
  { name: 'S&P 500', value: '5,281.93', change: '+0.76%', isPositive: true },
  { name: 'Nasdaq', value: '16,742.39', change: '+1.12%', isPositive: true },
  { name: 'Dow Jones', value: '38,677.36', change: '-0.13%', isPositive: false },
  { name: 'Russell 2000', value: '2,077.11', change: '+0.54%', isPositive: true },
  { name: 'Bitcoin', value: '$65,402.33', change: '+2.87%', isPositive: true },
  { name: 'Ethereum', value: '$3,471.58', change: '+1.95%', isPositive: true },
];

const ModernHome: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <>
      <Helmet>
        <title>StockPilot | Modern Trading Platform</title>
      </Helmet>
      
      <MainNavigationBar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div
          className="absolute inset-0 flex items-center justify-center -z-10"
          aria-hidden="true"
        >
          <div
            className={cn(
              "h-[800px] w-[800px] rounded-full",
              isDark 
                ? "bg-gradient-radial from-primary/20 to-transparent" 
                : "bg-gradient-radial from-primary/10 to-transparent"
            )}
          />
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
              Powered by advanced AI
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Intelligent Investing <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Made Effortless
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Commission-free trading with powerful AI-driven insights tailored to your financial goals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/auth/register">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/learn">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Market Indices */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="px-4 py-3 bg-card/50 backdrop-blur-sm border border-border/40 rounded-xl">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {marketIndices.map((index, i) => (
                  <div key={i} className="flex flex-col items-center justify-center text-center">
                    <p className="text-sm font-medium text-muted-foreground">{index.name}</p>
                    <p className="text-base font-bold">{index.value}</p>
                    <p className={cn(
                      "text-xs font-medium",
                      index.isPositive ? "text-green-500" : "text-red-500"
                    )}>
                      {index.change}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Next-Generation Trading Platform
            </h2>
            <p className="text-xl text-muted-foreground">
              Experience the future of investing with powerful tools and real-time insights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div 
            className={cn(
              "rounded-2xl overflow-hidden relative",
              isDark 
                ? "bg-gradient-to-r from-card to-muted border border-border/40" 
                : "bg-gradient-to-r from-card to-muted/50 border border-border/30"
            )}
          >
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
            
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start your investing journey?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Join thousands of investors using StockPilot to build their financial future.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link to="/auth/register">
                      Create Account <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/dashboard">
                      View Demo
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <TrendingUp className="h-3 w-3" />
                  </div>
                  <div>
                    <h3 className="font-medium">Advanced Portfolio Analytics</h3>
                    <p className="text-sm text-muted-foreground">Track performance and get personalized insights</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Globe className="h-3 w-3" />
                  </div>
                  <div>
                    <h3 className="font-medium">Global Market Access</h3>
                    <p className="text-sm text-muted-foreground">Trade stocks, ETFs, and cryptocurrencies</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Shield className="h-3 w-3" />
                  </div>
                  <div>
                    <h3 className="font-medium">Bank-Level Security</h3>
                    <p className="text-sm text-muted-foreground">Your investments are protected with enterprise-grade encryption</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Search className="h-3 w-3" />
                  </div>
                  <div>
                    <h3 className="font-medium">Research & Discovery</h3>
                    <p className="text-sm text-muted-foreground">Find new investment opportunities with AI-powered screening</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Stocks</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">ETFs</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Options</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Crypto</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Learn</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Investing 101</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Trading Basics</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Market News</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Disclosures</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <DollarSign className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">StockPilot</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} StockPilot. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ModernHome;
