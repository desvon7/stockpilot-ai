
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AccountSidebar from '@/components/layout/AccountSidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';

interface AccountLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showFooter?: boolean;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ 
  children, 
  title,
  description,
  showFooter = true
}) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
    )}>
      {title && (
        <Helmet>
          <title>{title} | StockPilot</title>
          {description && <meta name="description" content={description} />}
        </Helmet>
      )}
      
      <Navbar />
      
      <div className="flex-grow flex mt-16">
        <AccountSidebar />
        
        <main className={cn(
          "flex-grow p-4 md:p-6 overflow-x-hidden",
          isMobile ? "pb-20" : "" // Add padding at bottom for mobile to avoid content being hidden by nav
        )}>
          {title && <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{title}</h1>}
          {children}
        </main>
      </div>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default AccountLayout;
