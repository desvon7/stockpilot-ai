
import React from "react";
import { useLocation } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ReportsAndStatements from "@/pages/ReportsAndStatements";
import TaxCenter from "@/pages/TaxCenter";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import KeyboardShortcuts from "@/pages/KeyboardShortcuts";
import NotFound from "@/pages/NotFound";

const AccountRoutes: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Wrap content with ProtectedRoute
  const renderProtected = (component: React.ReactNode) => (
    <ProtectedRoute>{component}</ProtectedRoute>
  );

  // Handle specific paths
  if (path === "/reports-and-statements") {
    return renderProtected(<ReportsAndStatements />);
  } else if (path === "/tax-center") {
    return renderProtected(<TaxCenter />);
  } else if (path === "/history") {
    return renderProtected(<History />);
  } else if (path === "/settings") {
    return renderProtected(<Settings />);
  } else if (path === "/help") {
    return renderProtected(<Help />);
  } else if (path === "/keyboard-shortcuts") {
    return renderProtected(<KeyboardShortcuts />);
  }

  // Fallback for account routes
  return renderProtected(<NotFound />);
};

export default AccountRoutes;
