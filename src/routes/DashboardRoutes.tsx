
import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Watchlists from "@/pages/Watchlists";
import StockBrowser from "@/pages/StockBrowser";
import StockDetail from "@/pages/StockDetail";
import NewsFeed from "@/pages/NewsFeed";
import Transactions from "@/pages/Transactions";
import TrendingAssets from "@/pages/TrendingAssets";

const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
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
    </Routes>
  );
};

export default DashboardRoutes;
