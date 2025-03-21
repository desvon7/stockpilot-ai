
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
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
  
  return <>{children}</>;
};

export default ProtectedRoute;
