
import React, { Suspense, lazy, memo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

// Create a client for React Query with improved settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1, // Reduce retries for faster feedback
      refetchInterval: false, // Disable polling by default
    },
  },
});

// Lazy-load route components
const PublicRoutes = lazy(() => import('./routes/PublicRoutes'));
const AccountRoutes = lazy(() => import('./routes/AccountRoutes'));
const DashboardRoutes = lazy(() => import('./routes/DashboardRoutes'));
const InvestingRoutes = lazy(() => import('./routes/InvestingRoutes'));

// Loading component (memoized for performance)
const LoadingFallback = memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
));
LoadingFallback.displayName = 'LoadingFallback';

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider defaultTheme="system" storageKey="theme">
            <AuthProvider>
              <PreferencesProvider>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/*" element={<PublicRoutes />} />
                    
                    {/* Protected routes */}
                    <Route 
                      path="/account/*" 
                      element={
                        <ProtectedRoute>
                          <AccountRoutes />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard/*" 
                      element={
                        <ProtectedRoute>
                          <DashboardRoutes />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/investing/*" 
                      element={
                        <ProtectedRoute>
                          <InvestingRoutes />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </Suspense>
                <Toaster position="top-right" />
              </PreferencesProvider>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
