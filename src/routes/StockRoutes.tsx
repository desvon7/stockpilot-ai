
import { Route } from "react-router-dom";
import StockBrowser from "@/pages/StockBrowser";
import StockDetail from "@/pages/StockDetail";
import Watchlists from "@/pages/Watchlists";
import TrendingAssets from "@/pages/TrendingAssets";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const StockRoutes = () => {
  return (
    <>
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
        path="/trending"
        element={
          <ProtectedRoute>
            <TrendingAssets />
          </ProtectedRoute>
        }
      />
    </>
  );
};

export default StockRoutes;
