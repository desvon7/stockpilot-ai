
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

// Eagerly load the most frequently used pages
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import Portfolio from "@/pages/Portfolio";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";

// Lazy load less-frequently used pages
const StockDetail = lazy(() => import("@/pages/StockDetail"));
const Watchlists = lazy(() => import("@/pages/Watchlists"));
const Transactions = lazy(() => import("@/pages/Transactions"));
const FinancialNews = lazy(() => import("@/pages/FinancialNews"));
const Settings = lazy(() => import("@/pages/Settings"));
const Transfers = lazy(() => import("@/pages/Transfers"));
const NewsFeed = lazy(() => import("@/pages/NewsFeed"));
const Recurring = lazy(() => import("@/pages/Recurring"));
const StockLending = lazy(() => import("@/pages/StockLending"));
const TaxCenter = lazy(() => import("@/pages/TaxCenter"));
const ReportsAndStatements = lazy(() => import("@/pages/ReportsAndStatements"));
const TrendingAssets = lazy(() => import("@/pages/TrendingAssets"));
const StockBrowser = lazy(() => import("@/pages/StockBrowser"));
const Crypto = lazy(() => import("@/pages/Crypto"));
const Investing = lazy(() => import("@/pages/Investing"));
const Spending = lazy(() => import("@/pages/Spending"));
const History = lazy(() => import("@/pages/History"));
const KeyboardShortcuts = lazy(() => import("@/pages/KeyboardShortcuts"));
const Help = lazy(() => import("@/pages/Help"));

// Loading placeholder
const LoadingFallback = () => (
  <div className="p-6 space-y-4">
    <Skeleton className="h-12 w-3/4" />
    <Skeleton className="h-48 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

// This routes component handles all authenticated routes
const AccountRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="home" element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="stocks/:symbol" element={<StockDetail />} />
        <Route path="stocks" element={<StockBrowser />} />
        <Route path="watchlists" element={<Watchlists />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="settings" element={<Settings />} />
        <Route path="transfers" element={<Transfers />} />
        <Route path="news" element={<FinancialNews />} />
        <Route path="news-feed" element={<NewsFeed />} />
        <Route path="recurring" element={<Recurring />} />
        <Route path="stock-lending" element={<StockLending />} />
        <Route path="tax-center" element={<TaxCenter />} />
        <Route path="reports-and-statements" element={<ReportsAndStatements />} />
        <Route path="trending-assets" element={<TrendingAssets />} />
        <Route path="crypto" element={<Crypto />} />
        <Route path="investing/*" element={<Investing />} />
        <Route path="spending" element={<Spending />} />
        <Route path="history" element={<History />} />
        <Route path="keyboard-shortcuts" element={<KeyboardShortcuts />} />
        <Route path="help" element={<Help />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AccountRoutes;
