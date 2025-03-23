
import { Route } from "react-router-dom";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import KeyboardShortcuts from "@/pages/KeyboardShortcuts";
import NewsFeed from "@/pages/NewsFeed";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const SupportRoutes = () => {
  return (
    <>
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
      <Route
        path="/news"
        element={
          <ProtectedRoute>
            <NewsFeed />
          </ProtectedRoute>
        }
      />
    </>
  );
};

export default SupportRoutes;
