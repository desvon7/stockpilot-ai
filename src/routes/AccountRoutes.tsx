
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ReportsAndStatements from "@/pages/ReportsAndStatements";
import TaxCenter from "@/pages/TaxCenter";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import KeyboardShortcuts from "@/pages/KeyboardShortcuts";

const AccountRoutes: React.FC = () => {
  return (
    <>
      <Route
        path="/reports-and-statements"
        element={
          <ProtectedRoute>
            <ReportsAndStatements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tax-center"
        element={
          <ProtectedRoute>
            <TaxCenter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        }
      />
      <Route
        path="/keyboard-shortcuts"
        element={
          <ProtectedRoute>
            <KeyboardShortcuts />
          </ProtectedRoute>
        }
      />
    </>
  );
};

export default AccountRoutes;
