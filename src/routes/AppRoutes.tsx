
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

// Route Groups
import AuthRoutes from "./AuthRoutes";
import DashboardRoutes from "./DashboardRoutes";
import FinanceRoutes from "./FinanceRoutes";
import ReportRoutes from "./ReportRoutes";
import StockRoutes from "./StockRoutes";
import SupportRoutes from "./SupportRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />}>
        <Route index element={<Home />} />
        {/* Auth Routes */}
        <AuthRoutes />
      </Route>

      {/* Dashboard Routes */}
      <DashboardRoutes />

      {/* Finance Routes */}
      <FinanceRoutes />

      {/* Report Routes */}
      <ReportRoutes />
      
      {/* Stock Market Routes */}
      <StockRoutes />
      
      {/* Support & Settings Routes */}
      <SupportRoutes />

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
