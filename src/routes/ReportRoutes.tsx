
import { Route } from "react-router-dom";
import ReportsAndStatements from "@/pages/ReportsAndStatements";
import TaxCenter from "@/pages/TaxCenter";
import History from "@/pages/History";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const ReportRoutes = () => {
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
    </>
  );
};

export default ReportRoutes;
