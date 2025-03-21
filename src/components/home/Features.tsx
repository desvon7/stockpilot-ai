
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/utils/animations';
import {
  LineChart,
  Brain,
  TrendingUp,
  Wallet,
  Shield,
  Zap,
  Phone,
  Settings
} from 'lucide-react';
import StockChart from '@/components/ui/StockChart';
import { generateChartData } from '@/utils/mockData';

const Features: React.FC = () => {
  const featureRef = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(featureRef, { threshold: 0.1 });
  
  const chartData = generateChartData(60, 0.02, 0.001);
  
  const features = [
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: 'AI-Powered Recommendations',
      description: 'Personalized stock recommendations based on your investment style, risk profile, and market conditions.'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-success" />,
      title: 'Predictive Analytics',
      description: 'Advanced algorithms forecast market trends and potential investment opportunities with high accuracy.'
    },
    {
      icon: <Wallet className="w-6 h-6 text-info" />,
      title: 'Portfolio Management',
      description: 'Automated portfolio balancing and optimization to maximize returns and minimize risk.'
    },
    {
      icon: <LineChart className="w-6 h-6 text-primary" />,
      title: 'Real-Time Market Data',
      description: 'Access to real-time stock quotes, charts, and market news to make informed decisions.'
    },
    {
      icon: <Shield className="w-6 h-6 text-info" />,
      title: 'Risk Management',
      description: 'AI-driven risk assessment tools identify potential vulnerabilities in your portfolio.'
    },
    {
      icon: <Zap className="w-6 h-6 text-success" />,
      title: 'Commission-Free Trading',
      description: 'Trade unlimited stocks, ETFs, and cryptocurrencies without paying commission fees.'
    },
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      title: 'Voice-Activated Trading',
      description: 'Place trades and check your portfolio using natural voice commands.'
    },
    {
      icon: <Settings className="w-6 h-6 text-info" />,
      title: 'Customizable Experience',
      description: 'Tailor the platform to your preferences with personalized dashboards and alerts.'
    }
  ];
  
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            AI-Powered Features for Smarter Trading
          </h2>
          <p className="text-xl text-muted-foreground">
            Our cutting-edge technology analyzes vast amounts of market data to deliver personalized insights and recommendations.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
          <div className="order-2 md:order-1">
            <div 
              ref={featureRef}
              className={cn(
                'space-y-8 transition-all duration-700 transform',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              )}
            >
              {features.slice(0, 4).map((feature, index) => (
                <div 
                  key={index} 
                  className="flex gap-4"
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease'
                  }}
                >
                  <div className="rounded-full bg-secondary p-3 h-fit">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <div className={cn(
              'glass-card rounded-lg p-6 transition-all duration-700 transform',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            )}>
              <div className="mb-4">
                <h3 className="text-lg font-medium">Market Prediction</h3>
                <p className="text-muted-foreground">AI-powered forecast with 89% confidence</p>
              </div>
              <StockChart data={chartData} />
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Our AI predicts a potential uptrend based on technical indicators, sentiment analysis, and market conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className={cn(
              'glass-card rounded-lg p-6 transition-all duration-700 transform',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            )}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-medium">Portfolio Analysis</h3>
                  <p className="text-muted-foreground">AI-optimized allocation</p>
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  93% Optimized
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Technology</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Healthcare</span>
                    <span className="font-medium">18%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-info rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Consumer Cyclical</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-success rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Financial Services</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-warning rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Other Sectors</span>
                    <span className="font-medium">13%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-muted-foreground rounded-full" style={{ width: '13%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Our AI suggests this allocation based on your risk profile, market conditions, and financial goals.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <div 
              className={cn(
                'space-y-8 transition-all duration-700 transform',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              )}
            >
              {features.slice(4, 8).map((feature, index) => (
                <div 
                  key={index} 
                  className="flex gap-4"
                  style={{ 
                    transitionDelay: `${(index + 4) * 100}ms`,
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease'
                  }}
                >
                  <div className="rounded-full bg-secondary p-3 h-fit">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <Link 
            to="/auth" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-all"
          >
            Start Trading Now
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
