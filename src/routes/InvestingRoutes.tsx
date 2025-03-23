
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Investing from "@/pages/Investing";
import Spending from "@/pages/Spending";
import Crypto from "@/pages/Crypto";
import Transfers from "@/pages/Transfers";
import Recurring from "@/pages/Recurring";
import StockLending from "@/pages/StockLending";

const InvestingRoutes: React.FC = () => {
  return (
    <>
      <Route
        path="/investing"
        element={
          <ProtectedRoute>
            <Investing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/spending"
        element={
          <ProtectedRoute>
            <Spending />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crypto"
        element={
          <ProtectedRoute>
            <Crypto />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transfers"
        element={
          <ProtectedRoute>
            <Transfers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recurring"
        element={
          <ProtectedRoute>
            <Recurring />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stock-lending"
        element={
          <ProtectedRoute>
            <StockLending />
          </ProtectedRoute>
        }
      />
    </>
  );
};

export default InvestingRoutes;
