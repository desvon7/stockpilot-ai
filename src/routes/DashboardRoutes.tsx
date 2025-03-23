
import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Watchlists from "@/pages/Watchlists";
import StockBrowser from "@/pages/StockBrowser";
import StockDetail from "@/pages/StockDetail";
import NewsFeed from "@/pages/NewsFeed";
import Transactions from "@/pages/Transactions";
import TrendingAssets from "@/pages/TrendingAssets";
import Portfolio from "@/pages/Portfolio";
import NotFound from "@/pages/NotFound";

const DashboardRoutes: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Wrap content with ProtectedRoute
  const renderProtected = (component: React.ReactNode) => (
    <ProtectedRoute>{component}</ProtectedRoute>
  );

  // Handle specific paths
  if (path === "/dashboard") {
    return renderProtected(<Dashboard />);
  } else if (path === "/profile") {
    return renderProtected(<Profile />);
  } else if (path === "/watchlists") {
    return renderProtected(<Watchlists />);
  } else if (path === "/stocks") {
    return renderProtected(<StockBrowser />);
  } else if (path.startsWith("/stocks/")) {
    return renderProtected(<StockDetail />);
  } else if (path === "/news") {
    return renderProtected(<NewsFeed />);
  } else if (path === "/transactions") {
    return renderProtected(<Transactions />);
  } else if (path === "/trending") {
    return renderProtected(<TrendingAssets />);
  } else if (path === "/portfolio") {
    return renderProtected(<Portfolio />);
  }

  // Fallback for dashboard routes
  return renderProtected(<NotFound />);
};

export default DashboardRoutes;
