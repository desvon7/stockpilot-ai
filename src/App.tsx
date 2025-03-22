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
import Investing from "@/pages/Investing";
import Spending from "@/pages/Spending";
import Crypto from "@/pages/Crypto";
import Transfers from "@/pages/Transfers";
import Recurring from "@/pages/Recurring";
import StockLending from "@/pages/StockLending";
import ReportsAndStatements from "@/pages/ReportsAndStatements";
import TaxCenter from "@/pages/TaxCenter";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import KeyboardShortcuts from "@/pages/KeyboardShortcuts";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="stock-pilot-theme">
        <HelmetProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />}>
                  <Route index element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/update-password" element={<UpdatePassword />} />
                </Route>
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
                  path="/investing"
                  element={
                    <ProtectedRoute>
                      <Investing />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/spending"
                  element={
                    <ProtectedRoute>
                      <Spending />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crypto"
                  element={
                    <ProtectedRoute>
                      <Crypto />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transfers"
                  element={
                    <ProtectedRoute>
                      <Transfers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recurring"
                  element={
                    <ProtectedRoute>
                      <Recurring />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/stock-lending"
                  element={
                    <ProtectedRoute>
                      <StockLending />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports-and-statements"
                  element={
                    <ProtectedRoute>
                      <ReportsAndStatements />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tax-center"
                  element={
                    <ProtectedRoute>
                      <TaxCenter />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/help"
                  element={
                    <ProtectedRoute>
                      <Help />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/keyboard-shortcuts"
                  element={
                    <ProtectedRoute>
                      <KeyboardShortcuts />
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
              <MobileMenu />
              <Toaster />
            </AuthProvider>
          </BrowserRouter>
        </HelmetProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
