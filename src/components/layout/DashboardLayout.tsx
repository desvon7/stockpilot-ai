
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Helmet } from 'react-helmet-async';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title = "Dashboard"
}) => {
  return (
    <>
      {title && (
        <Helmet>
          <title>{title} | StockPilot</title>
        </Helmet>
      )}
      <Navbar />
      <main className="min-h-screen pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default DashboardLayout;
