
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, DollarSign, Award, Shield, TrendingUp, PieChart } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import NavigationBar from '@/components/layout/NavigationBar';

const Index = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      <main>
        {/* Hero Section */}
        <section className={cn(
          "py-20 px-4",
          "bg-gradient-to-b from-background to-secondary/20"
        )}>
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Invest in your future with <span className="text-primary">StockPilot</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  The modern platform for stocks, ETFs, options, and crypto. 
                  All with zero commission fees.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className={cn(
                  "rounded-2xl overflow-hidden p-1",
                  isDark ? "bg-gray-800" : "bg-white shadow-xl"
                )}>
                  <img 
                    src="public/lovable-uploads/28b9ab24-c539-4d97-bdf4-0c6621fe68b2.png" 
                    alt="StockPilot Platform" 
                    className="rounded-xl w-full h-auto" 
                  />
                </div>
                
                <div className={cn(
                  "absolute -bottom-6 -left-6 p-4 rounded-xl",
                  isDark ? "bg-gray-800" : "bg-white shadow-lg"
                )}>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="font-medium">TSLA</span>
                    <span className="text-green-500">+2.4%</span>
                  </div>
                </div>
                
                <div className={cn(
                  "absolute -top-6 -right-6 p-4 rounded-xl",
                  isDark ? "bg-gray-800" : "bg-white shadow-lg"
                )}>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                    <span className="font-medium">AAPL</span>
                    <span className="text-primary">+1.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Every Investor</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to make informed investment decisions and grow your portfolio.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<BarChart2 className="h-10 w-10 text-primary" />}
                title="Advanced Charts"
                description="Track performance with real-time data and professional-grade charts."
              />
              
              <FeatureCard 
                icon={<DollarSign className="h-10 w-10 text-primary" />}
                title="Commission-Free Trading"
                description="Trade stocks, ETFs, and options with zero commission fees."
              />
              
              <FeatureCard 
                icon={<Award className="h-10 w-10 text-primary" />}
                title="Rewards Program"
                description="Earn points on trades, referrals, and daily logins that can be converted to free stocks."
              />
              
              <FeatureCard 
                icon={<Shield className="h-10 w-10 text-primary" />}
                title="Secure Investments"
                description="Your investments are protected up to $500,000 through our insurance."
              />
              
              <FeatureCard 
                icon={<TrendingUp className="h-10 w-10 text-primary" />}
                title="AI-Powered Insights"
                description="Get personalized investment recommendations based on your goals."
              />
              
              <FeatureCard 
                icon={<PieChart className="h-10 w-10 text-primary" />}
                title="Portfolio Diversification"
                description="Easily view your asset allocation and diversify your investments."
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className={cn(
          "py-20 px-4",
          "bg-gradient-to-br from-primary/10 to-background"
        )}>
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Your Investment Journey Today
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of investors who trust StockPilot for their financial goals. 
              Sign up in minutes and start trading today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Create an Account
              </Button>
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-card mt-auto py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">StockPilot</span>
              </div>
              <p className="text-muted-foreground">
                The modern platform for stocks, ETFs, options, and crypto.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Products</h3>
              <ul className="space-y-2">
                <li><Link to="/stocks" className="text-muted-foreground hover:text-foreground">Stocks</Link></li>
                <li><Link to="/crypto" className="text-muted-foreground hover:text-foreground">Crypto</Link></li>
                <li><Link to="/etfs" className="text-muted-foreground hover:text-foreground">ETFs</Link></li>
                <li><Link to="/options" className="text-muted-foreground hover:text-foreground">Options</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link to="/careers" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                <li><Link to="/press" className="text-muted-foreground hover:text-foreground">Press</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
                <li><Link to="/cookies" className="text-muted-foreground hover:text-foreground">Cookies</Link></li>
                <li><Link to="/licenses" className="text-muted-foreground hover:text-foreground">Licenses</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-6 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} StockPilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={cn(
      "p-6 rounded-xl transition-all duration-300",
      isDark 
        ? "bg-card hover:bg-card/80 border border-border" 
        : "bg-white hover:shadow-lg border border-border"
    )}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
