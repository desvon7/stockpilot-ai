
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Alert from '@/components/auth/Alert';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Alert />
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
