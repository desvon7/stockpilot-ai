
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '@/components/layout/NavigationBar';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Index;
