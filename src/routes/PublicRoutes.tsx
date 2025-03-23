
import React from "react";
import { Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

const PublicRoutes: React.FC = () => {
  return (
    <>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </>
  );
};

export default PublicRoutes;
