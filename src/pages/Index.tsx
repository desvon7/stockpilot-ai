
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import { Link } from 'react-router-dom';
import { 
  User, Briefcase, DollarSign, Bitcoin, ArrowRightLeft, 
  RefreshCw, BookText, FileText, Calculator, History, 
  Settings, HelpCircle, Keyboard
} from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Account Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { icon: <User size={24} />, label: "Profile" },
                { icon: <Briefcase size={24} />, label: "Investing" },
                { icon: <DollarSign size={24} />, label: "Spending" },
                { icon: <Bitcoin size={24} />, label: "Crypto" },
                { icon: <ArrowRightLeft size={24} />, label: "Transfers" },
                { icon: <RefreshCw size={24} />, label: "Recurring" },
                { icon: <BookText size={24} />, label: "Stock Lending" },
                { icon: <FileText size={24} />, label: "Reports" },
                { icon: <Calculator size={24} />, label: "Tax Center" },
                { icon: <History size={24} />, label: "History" },
                { icon: <Settings size={24} />, label: "Settings" },
                { icon: <Keyboard size={24} />, label: "Keyboard Shortcuts" }
              ].map((item, index) => (
                <div key={index} className="bg-card shadow-sm rounded-lg p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    {item.icon}
                  </div>
                  <h3 className="font-medium">{item.label}</h3>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/auth" className="inline-flex items-center justify-center h-10 px-6 font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
                Sign Up Now
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
