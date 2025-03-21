
import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please sign in to access this page", {
        id: "auth-required",
      });
    }
  }, [user, loading]);
  
  // Dev mode bypass for testing - allow access if development mode is enabled
  const isDev = import.meta.env.DEV;
  const devModeEnabled = isDev && (localStorage.getItem('devModeEnabled') === 'true' || 
    !!localStorage.getItem('supabase.auth.token'));
  
  if (devModeEnabled) {
    console.log('Dev mode enabled - bypassing authentication check');
    return <>{children || <Outlet />}</>;
  }
  
  // Show a more friendly loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-white text-sm">Loading your profile...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
