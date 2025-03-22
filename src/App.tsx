
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Home from "@/pages/Home";
import Watchlists from "@/pages/Watchlists";
import NotFound from "@/pages/NotFound";
import StockDetail from "@/pages/StockDetail";
import StockBrowser from "@/pages/StockBrowser";
import ResetPassword from "@/pages/ResetPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import NewsFeed from "@/pages/NewsFeed";
import Transactions from "@/pages/Transactions";
import TrendingAssets from "@/pages/TrendingAssets";
import Profile from "@/pages/Profile";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MobileMenu from "@/components/layout/MobileMenu";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="stock-pilot-theme">
        <HelmetProvider>
          <BrowserRouter>
            <AuthProvider>
              <MobileMenu />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/home" element={<Home />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/watchlists"
                  element={
                    <ProtectedRoute>
                      <Watchlists />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/stocks"
                  element={
                    <ProtectedRoute>
                      <StockBrowser />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/stocks/:symbol"
                  element={
                    <ProtectedRoute>
                      <StockDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/news"
                  element={
                    <ProtectedRoute>
                      <NewsFeed />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute>
                      <Transactions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trending"
                  element={
                    <ProtectedRoute>
                      <TrendingAssets />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </AuthProvider>
          </BrowserRouter>
        </HelmetProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
