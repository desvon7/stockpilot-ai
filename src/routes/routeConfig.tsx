
import React from "react";
import Index from "@/pages/Index";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Investing from "@/pages/Investing";
import Spending from "@/pages/Spending";
import Crypto from "@/pages/Crypto";
import Transfers from "@/pages/Transfers";
import Recurring from "@/pages/Recurring";
import StockLending from "@/pages/StockLending";
import Transactions from "@/pages/Transactions";
import ReportsAndStatements from "@/pages/ReportsAndStatements";
import TaxCenter from "@/pages/TaxCenter";
import History from "@/pages/History";
import StockBrowser from "@/pages/StockBrowser";
import StockDetail from "@/pages/StockDetail";
import Watchlists from "@/pages/Watchlists";
import TrendingAssets from "@/pages/TrendingAssets";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import KeyboardShortcuts from "@/pages/KeyboardShortcuts";
import NewsFeed from "@/pages/NewsFeed";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Define the route configuration interface
export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
  title?: string;
  requiresAuth?: boolean;
  permissions?: string[];
  roles?: string[];
}

// Public routes
export const publicRoutes: RouteConfig[] = [
  {
    path: "/",
    element: <Index />,
    title: "Home",
    children: [
      {
        path: "",
        element: <Home />,
        title: "StockPilot - Smart Stock Trading",
      },
      {
        path: "auth",
        element: <Auth />,
        title: "Authentication",
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
        title: "Reset Password",
      },
      {
        path: "update-password",
        element: <UpdatePassword />,
        title: "Update Password",
      },
    ],
  },
];

// Dashboard routes
export const dashboardRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    title: "Dashboard",
    requiresAuth: true,
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
    title: "User Profile",
    requiresAuth: true,
  },
];

// Finance routes
export const financeRoutes: RouteConfig[] = [
  {
    path: "/investing",
    element: <ProtectedRoute><Investing /></ProtectedRoute>,
    title: "Investing",
    requiresAuth: true,
  },
  {
    path: "/spending",
    element: <ProtectedRoute><Spending /></ProtectedRoute>,
    title: "Spending",
    requiresAuth: true,
  },
  {
    path: "/crypto",
    element: <ProtectedRoute><Crypto /></ProtectedRoute>,
    title: "Cryptocurrency",
    requiresAuth: true,
  },
  {
    path: "/transfers",
    element: <ProtectedRoute><Transfers /></ProtectedRoute>,
    title: "Transfers",
    requiresAuth: true,
  },
  {
    path: "/recurring",
    element: <ProtectedRoute><Recurring /></ProtectedRoute>,
    title: "Recurring Investments",
    requiresAuth: true,
  },
  {
    path: "/stock-lending",
    element: <ProtectedRoute><StockLending /></ProtectedRoute>,
    title: "Stock Lending",
    requiresAuth: true,
  },
  {
    path: "/transactions",
    element: <ProtectedRoute><Transactions /></ProtectedRoute>,
    title: "Transactions",
    requiresAuth: true,
  },
];

// Report routes
export const reportRoutes: RouteConfig[] = [
  {
    path: "/reports-and-statements",
    element: <ProtectedRoute><ReportsAndStatements /></ProtectedRoute>,
    title: "Reports and Statements",
    requiresAuth: true,
  },
  {
    path: "/tax-center",
    element: <ProtectedRoute><TaxCenter /></ProtectedRoute>,
    title: "Tax Center",
    requiresAuth: true,
  },
  {
    path: "/history",
    element: <ProtectedRoute><History /></ProtectedRoute>,
    title: "History",
    requiresAuth: true,
  },
];

// Stock routes
export const stockRoutes: RouteConfig[] = [
  {
    path: "/watchlists",
    element: <ProtectedRoute><Watchlists /></ProtectedRoute>,
    title: "Watchlists",
    requiresAuth: true,
  },
  {
    path: "/stocks",
    element: <ProtectedRoute><StockBrowser /></ProtectedRoute>,
    title: "Stock Browser",
    requiresAuth: true,
  },
  {
    path: "/stocks/:symbol",
    element: <ProtectedRoute><StockDetail /></ProtectedRoute>,
    title: "Stock Details",
    requiresAuth: true,
  },
  {
    path: "/trending",
    element: <ProtectedRoute><TrendingAssets /></ProtectedRoute>,
    title: "Trending Assets",
    requiresAuth: true,
  },
];

// Support routes
export const supportRoutes: RouteConfig[] = [
  {
    path: "/settings",
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
    title: "Settings",
    requiresAuth: true,
  },
  {
    path: "/help",
    element: <ProtectedRoute><Help /></ProtectedRoute>,
    title: "Help",
    requiresAuth: true,
  },
  {
    path: "/keyboard-shortcuts",
    element: <ProtectedRoute><KeyboardShortcuts /></ProtectedRoute>,
    title: "Keyboard Shortcuts",
    requiresAuth: true,
  },
  {
    path: "/news",
    element: <ProtectedRoute><NewsFeed /></ProtectedRoute>,
    title: "Financial News",
    requiresAuth: true,
  },
];

// Fallback route
export const fallbackRoute: RouteConfig = {
  path: "*",
  element: <NotFound />,
  title: "Page Not Found",
};

// All routes combined
export const allRoutes: RouteConfig[] = [
  ...publicRoutes,
  ...dashboardRoutes,
  ...financeRoutes,
  ...reportRoutes,
  ...stockRoutes,
  ...supportRoutes,
  fallbackRoute,
];
