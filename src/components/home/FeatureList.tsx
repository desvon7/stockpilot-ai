
import React from 'react';
import FeatureItem from './FeatureItem';
import { Brain, TrendingUp, Wallet, LineChart, Shield, Zap, Phone, Settings } from 'lucide-react';

interface FeatureListProps {
  isInView: boolean;
  startIndex: number;
  endIndex: number;
}

const FeatureList: React.FC<FeatureListProps> = ({ isInView, startIndex, endIndex }) => {
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
    <div className="space-y-8">
      {features.slice(startIndex, endIndex).map((feature, index) => (
        <FeatureItem 
          key={index} 
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          index={index + startIndex}
          isInView={isInView}
        />
      ))}
    </div>
  );
};

export default FeatureList;
