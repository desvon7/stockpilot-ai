
import React from "react";
import { Routes, Route } from "react-router-dom";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import Portfolio from "@/pages/Portfolio";
import StockDetail from "@/pages/StockDetail";
import Watchlists from "@/pages/Watchlists";
import Transactions from "@/pages/Transactions";
import FinancialNews from "@/pages/FinancialNews";
import Settings from "@/pages/Settings";
import Transfers from "@/pages/Transfers";
import NewsFeed from "@/pages/NewsFeed";
import Recurring from "@/pages/Recurring";
import StockLending from "@/pages/StockLending";
import TaxCenter from "@/pages/TaxCenter";
import ReportsAndStatements from "@/pages/ReportsAndStatements";
import TrendingAssets from "@/pages/TrendingAssets";
import StockBrowser from "@/pages/StockBrowser";
import NotFound from "@/pages/NotFound";
import Crypto from "@/pages/Crypto";
import Investing from "@/pages/Investing";
import Spending from "@/pages/Spending";
import History from "@/pages/History";
import KeyboardShortcuts from "@/pages/KeyboardShortcuts";
import Help from "@/pages/Help";

// This routes component handles all authenticated routes
const AccountRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/stocks/:symbol" element={<StockDetail />} />
      <Route path="/watchlists" element={<Watchlists />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/transfers" element={<Transfers />} />
      <Route path="/news" element={<FinancialNews />} />
      <Route path="/news-feed" element={<NewsFeed />} />
      <Route path="/recurring" element={<Recurring />} />
      <Route path="/stock-lending" element={<StockLending />} />
      <Route path="/tax-center" element={<TaxCenter />} />
      <Route path="/reports" element={<ReportsAndStatements />} />
      <Route path="/trending-assets" element={<TrendingAssets />} />
      <Route path="/stocks" element={<StockBrowser />} />
      <Route path="/crypto" element={<Crypto />} />
      <Route path="/investing/*" element={<Investing />} />
      <Route path="/spending" element={<Spending />} />
      <Route path="/history" element={<History />} />
      <Route path="/keyboard-shortcuts" element={<KeyboardShortcuts />} />
      <Route path="/help" element={<Help />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AccountRoutes;
