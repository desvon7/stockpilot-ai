
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Eagerly load most used components
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

// Lazy load less frequently used components
const Profile = lazy(() => import("@/pages/Profile"));
const Watchlists = lazy(() => import("@/pages/Watchlists"));
const StockBrowser = lazy(() => import("@/pages/StockBrowser"));
const StockDetail = lazy(() => import("@/pages/StockDetail"));
const NewsFeed = lazy(() => import("@/pages/NewsFeed"));
const Transactions = lazy(() => import("@/pages/Transactions"));
const TrendingAssets = lazy(() => import("@/pages/TrendingAssets"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));

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

const DashboardRoutes: React.FC = () => {
  return (
    <DashboardLayout title="Dashboard">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="watchlists" element={<Watchlists />} />
          <Route path="stocks" element={<StockBrowser />} />
          <Route path="stocks/:symbol" element={<StockDetail />} />
          <Route path="news" element={<NewsFeed />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="trending" element={<TrendingAssets />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
};

export default DashboardRoutes;
