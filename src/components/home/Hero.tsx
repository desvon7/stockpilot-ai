
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, LineChart, Zap, ShieldCheck } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
      {/* Background elements */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent -z-10"
        aria-hidden="true"
      />
      <div 
        className="absolute top-0 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 -z-10"
        aria-hidden="true"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-20">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
            <span className="text-xs font-medium">Powered by AI</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight animate-slide-up">
            Intelligent Trading. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-info">
              Powered by AI.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 md:mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Commission-free trading with AI-powered insights and recommendations tailored to your financial goals.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link 
              to="/auth" 
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
            >
              Get Started
              <ChevronRight size={18} />
            </Link>
            <Link 
              to="/learn" 
              className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="glass-card rounded-lg p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="rounded-full bg-primary/10 p-3 inline-block mb-4">
              <LineChart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">AI-Powered Insights</h3>
            <p className="text-muted-foreground">Machine learning algorithms analyze market trends to provide personalized trading recommendations.</p>
          </div>
          
          <div className="glass-card rounded-lg p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="rounded-full bg-success/10 p-3 inline-block mb-4">
              <Zap className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-lg font-medium mb-2">Commission-Free</h3>
            <p className="text-muted-foreground">Trade stocks, ETFs, and cryptocurrencies with zero commission fees on all transactions.</p>
          </div>
          
          <div className="glass-card rounded-lg p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
            <div className="rounded-full bg-info/10 p-3 inline-block mb-4">
              <ShieldCheck className="w-6 h-6 text-info" />
            </div>
            <h3 className="text-lg font-medium mb-2">Bank-Level Security</h3>
            <p className="text-muted-foreground">Enterprise-grade encryption and security protocols to keep your investments safe.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
