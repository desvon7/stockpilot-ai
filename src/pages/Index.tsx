
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, LineChart, Shield, Zap, X } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Redirect logged-in users to home dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/home');
    }
  }, [user, navigate, loading]);
  
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Mobile Menu Overlay - similar to the image */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">StockPilot</h2>
            <button onClick={toggleMobileMenu} className="p-2">
              <X size={24} />
            </button>
          </div>
          
          <p className="text-muted-foreground mb-8">Your personal stock portfolio tracker</p>
          
          <div className="flex flex-col space-y-4 text-lg">
            <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
            <Link to="/stocks" className="hover:text-primary">Browse Stocks</Link>
            <Link to="/watchlists" className="hover:text-primary">Watchlists</Link>
            <Link to="/news-feed" className="hover:text-primary">News Feed</Link>
            <Link to="/transactions" className="hover:text-primary">Transactions</Link>
            <Link to="/trending-assets" className="hover:text-primary">Trending Assets</Link>
          </div>
          
          <div className="mt-auto">
            <Button 
              variant="outline" 
              className="w-full justify-start mb-4"
              onClick={() => {
                document.documentElement.classList.toggle('dark');
              }}
            >
              <span className="flex items-center">
                <span className="i-lucide-sun dark:i-lucide-moon mr-2"></span>
                Light
              </span>
            </Button>
            
            {user ? (
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={signOut}
              >
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
      
      <main className="flex-grow">
        {/* Hero Section with Image Background */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20 z-0">
            <img 
              src="/lovable-uploads/0f3e8418-10ff-4d21-aa1c-5f2f3040b238.png" 
              alt="Stock trading platform" 
              className="w-full h-full object-cover mix-blend-overlay opacity-20"
            />
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
                Trade smarter with AI-powered insights
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/80">
                StockPilot gives you the tools and insights to make better investment decisions with real-time data and AI recommendations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="lg" className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white">
                    Get Started <ArrowRight className="ml-2" size={18} />
                  </Button>
                </Link>
                <Link to="/learn">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Feature Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Why choose StockPilot?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Real-time analytics</h3>
                <p className="text-muted-foreground">
                  Get instant access to market data and advanced analytics to make informed decisions.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Commission-free trading</h3>
                <p className="text-muted-foreground">
                  Trade stocks, ETFs, and cryptocurrencies with zero commission fees on all transactions.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Secure investments</h3>
                <p className="text-muted-foreground">
                  Your investments are protected with enterprise-grade security and encryption.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to start investing?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of investors who trust StockPilot for their trading needs.
            </p>
            
            <Link to="/auth">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                Create your account <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
