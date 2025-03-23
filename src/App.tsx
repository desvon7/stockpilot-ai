
import React, { Suspense, lazy, memo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
                    <Route path="/" element={<PublicRoutes />} />
                    <Route path="/auth/*" element={<PublicRoutes />} />
                    <Route path="/reset-password" element={<PublicRoutes />} />
                    <Route path="/update-password" element={<PublicRoutes />} />
                    
                    {/* Protected account routes */}
                    <Route 
                      path="/account/*" 
                      element={
                        <ProtectedRoute>
                          <AccountRoutes />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Direct access to account pages */}
                    <Route 
                      path="/home" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/account/home" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/account/profile" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/account/dashboard" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/portfolio" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/account/portfolio" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/investing/*" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/account/investing/*" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/spending" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/account/spending" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/crypto" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/account/crypto" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/transfers" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/account/transfers" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/recurring" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/account/recurring" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/stock-lending" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/account/stock-lending" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/reports-and-statements" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/account/reports-and-statements" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/tax-center" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/account/tax-center" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/history" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/account/history" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/account/settings" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/help" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/account/help" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/keyboard-shortcuts" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/account/keyboard-shortcuts" replace />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
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
