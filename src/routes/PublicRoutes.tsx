
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

const PublicRoutes: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Render appropriate component based on the current path
  if (path === "/") {
    return <Index />;
  } else if (path === "/auth") {
    return <Auth />;
  } else if (path === "/reset-password") {
    return <ResetPassword />;
  } else if (path === "/update-password") {
    return <UpdatePassword />;
  } else if (path === "/home") {
    return <Home />;
  }
  
  // Fallback for public routes
  return <NotFound />;
};

export default PublicRoutes;
