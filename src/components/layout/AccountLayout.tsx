
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AccountSidebar from '@/components/layout/AccountSidebar';

interface AccountLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col">
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
