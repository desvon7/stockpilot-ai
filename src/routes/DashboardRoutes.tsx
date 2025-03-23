
import { Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const DashboardRoutes = () => {
  return (
    <>
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
    </>
  );
};

export default DashboardRoutes;
