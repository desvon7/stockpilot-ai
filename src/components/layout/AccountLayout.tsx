
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import AccountSidebar from '@/components/layout/AccountSidebar';

interface AccountLayoutProps {
  children?: ReactNode;
}

const AccountLayout = ({ children }: AccountLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 lg:w-72">
            <AccountSidebar />
          </div>
          <div className="flex-1">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
