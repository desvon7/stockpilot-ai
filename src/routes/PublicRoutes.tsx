
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

// Eagerly load the most frequently accessed pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";

// Lazily load less frequently accessed pages
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const UpdatePassword = lazy(() => import("@/pages/UpdatePassword"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Loading placeholder
const LoadingFallback = () => (
  <div className="p-6 space-y-4">
    <Skeleton className="h-12 w-3/4" />
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-32 w-full" />
  </div>
);

const PublicRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default PublicRoutes;
