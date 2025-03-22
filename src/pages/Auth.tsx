
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTitle } from '@/hooks/use-title';
import Navbar from '@/components/layout/Navbar';

const Auth = () => {
  useTitle('Authentication');
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Auth;
