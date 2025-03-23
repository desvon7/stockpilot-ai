
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import AccountLayout from "@/components/layout/AccountLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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

// Layout wrapper component that properly uses Outlet to pass children to AccountLayout
const AccountLayoutWrapper = () => (
  <AccountLayout>
    <Outlet />
  </AccountLayout>
);

// This routes component handles all authenticated routes
const AccountRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<AccountLayoutWrapper />}>
          <Route index element={<Navigate to="/account/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="stocks/:symbol" element={
            <Suspense fallback={<LoadingFallback />}>
              <StockDetail />
            </Suspense>
          } />
          <Route path="stocks" element={
            <Suspense fallback={<LoadingFallback />}>
              <StockBrowser />
            </Suspense>
          } />
          <Route path="watchlists" element={
            <Suspense fallback={<LoadingFallback />}>
              <Watchlists />
            </Suspense>
          } />
          <Route path="transactions" element={
            <Suspense fallback={<LoadingFallback />}>
              <Transactions />
            </Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={<LoadingFallback />}>
              <Settings />
            </Suspense>
          } />
          <Route path="transfers" element={
            <Suspense fallback={<LoadingFallback />}>
              <Transfers />
            </Suspense>
          } />
          <Route path="news" element={
            <Suspense fallback={<LoadingFallback />}>
              <FinancialNews />
            </Suspense>
          } />
          <Route path="news-feed" element={
            <Suspense fallback={<LoadingFallback />}>
              <NewsFeed />
            </Suspense>
          } />
          <Route path="recurring" element={
            <Suspense fallback={<LoadingFallback />}>
              <Recurring />
            </Suspense>
          } />
          <Route path="stock-lending" element={
            <Suspense fallback={<LoadingFallback />}>
              <StockLending />
            </Suspense>
          } />
          <Route path="tax-center" element={
            <Suspense fallback={<LoadingFallback />}>
              <TaxCenter />
            </Suspense>
          } />
          <Route path="reports-and-statements" element={
            <Suspense fallback={<LoadingFallback />}>
              <ReportsAndStatements />
            </Suspense>
          } />
          <Route path="trending-assets" element={
            <Suspense fallback={<LoadingFallback />}>
              <TrendingAssets />
            </Suspense>
          } />
          <Route path="crypto" element={
            <Suspense fallback={<LoadingFallback />}>
              <Crypto />
            </Suspense>
          } />
          <Route path="investing/*" element={
            <Suspense fallback={<LoadingFallback />}>
              <Investing />
            </Suspense>
          } />
          <Route path="spending" element={
            <Suspense fallback={<LoadingFallback />}>
              <Spending />
            </Suspense>
          } />
          <Route path="history" element={
            <Suspense fallback={<LoadingFallback />}>
              <History />
            </Suspense>
          } />
          <Route path="keyboard-shortcuts" element={
            <Suspense fallback={<LoadingFallback />}>
              <KeyboardShortcuts />
            </Suspense>
          } />
          <Route path="help" element={
            <Suspense fallback={<LoadingFallback />}>
              <Help />
            </Suspense>
          } />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AccountRoutes;
