
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AccountSidebar from '@/components/layout/AccountSidebar';
import { useTheme } from '@/hooks/useTheme';

interface AccountLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children, title }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar />
      <div className="flex-grow flex mt-16">
        <AccountSidebar />
        <main className="flex-grow p-6">
          {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AccountLayout;
