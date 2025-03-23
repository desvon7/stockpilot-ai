
import { Route } from "react-router-dom";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import UpdatePassword from "@/pages/UpdatePassword";

const AuthRoutes = () => {
  return (
    <>
      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
    </>
  );
};

export default AuthRoutes;
