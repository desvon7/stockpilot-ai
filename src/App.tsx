
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "@/hooks/useTheme";
import { Toaster } from 'sonner';

import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import ResetPassword from '@/pages/ResetPassword';
import UpdatePassword from '@/pages/UpdatePassword';
import Dashboard from '@/pages/Dashboard';
import NewsFeed from '@/pages/NewsFeed';
import Watchlists from '@/pages/Watchlists';
import Transactions from '@/pages/Transactions';
import StockDetail from '@/pages/StockDetail';
import TrendingAssets from '@/pages/TrendingAssets';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MobileMenu from '@/components/layout/MobileMenu';
import { Navbar } from '@/components/layout/Navbar';

// Add the import for StockBrowser
import StockBrowser from '@/pages/StockBrowser';

function App() {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="App">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {isMounted && (
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            
            <Routes>
              <Route index element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/news" element={
                <ProtectedRoute>
                  <NewsFeed />
                </ProtectedRoute>
              } />
              <Route path="/watchlists" element={
                <ProtectedRoute>
                  <Watchlists />
                </ProtectedRoute>
              } />
              <Route path="/transactions" element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              } />
              <Route path="/stocks" element={
                <ProtectedRoute>
                  <StockBrowser />
                </ProtectedRoute>
              } />
              <Route path="/stocks/:symbol" element={
                <ProtectedRoute>
                  <StockDetail />
                </ProtectedRoute>
              } />
              <Route path="/trending" element={
                <ProtectedRoute>
                  <TrendingAssets />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <Toaster richColors closeButton />
          </div>
        )}
      </ThemeProvider>
    </div>
  );
}

export default App;
