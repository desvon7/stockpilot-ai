
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/utils/animations';
import { ChevronRight } from 'lucide-react';
import { generateChartData } from '@/utils/mockData';
import FeatureList from './FeatureList';
import MarketPredictionCard from './MarketPredictionCard';
import PortfolioAnalysisCard from './PortfolioAnalysisCard';

const Features: React.FC = () => {
  const featureRef = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(featureRef, { threshold: 0.1 });
  
  const chartData = generateChartData(60, 0.02, 0.001);
  
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
                'transition-all duration-700 transform',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              )}
            >
              <FeatureList 
                isInView={isInView} 
                startIndex={0} 
                endIndex={4} 
              />
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <MarketPredictionCard data={chartData} isInView={isInView} />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <PortfolioAnalysisCard isInView={isInView} />
          </div>
          
          <div>
            <div 
              className={cn(
                'transition-all duration-700 transform',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              )}
            >
              <FeatureList 
                isInView={isInView} 
                startIndex={4} 
                endIndex={8} 
              />
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
