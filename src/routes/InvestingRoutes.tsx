
import React from "react";
import { useLocation } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Investing from "@/pages/Investing";
import Spending from "@/pages/Spending";
import Crypto from "@/pages/Crypto";
import Transfers from "@/pages/Transfers";
import Recurring from "@/pages/Recurring";
import StockLending from "@/pages/StockLending";
import NotFound from "@/pages/NotFound";

const InvestingRoutes: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Wrap content with ProtectedRoute
  const renderProtected = (component: React.ReactNode) => (
    <ProtectedRoute>{component}</ProtectedRoute>
  );

  // Handle specific paths
  if (path === "/investing") {
    return renderProtected(<Investing />);
  } else if (path === "/spending") {
    return renderProtected(<Spending />);
  } else if (path === "/crypto") {
    return renderProtected(<Crypto />);
  } else if (path === "/transfers") {
    return renderProtected(<Transfers />);
  } else if (path === "/recurring") {
    return renderProtected(<Recurring />);
  } else if (path === "/stock-lending") {
    return renderProtected(<StockLending />);
  }

  // Fallback for investing routes
  return renderProtected(<NotFound />);
};

export default InvestingRoutes;
