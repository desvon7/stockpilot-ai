
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import MobileMenu from "@/components/layout/MobileMenu";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from "react-helmet-async";

// Route components
import PublicRoutes from "@/routes/PublicRoutes";
import DashboardRoutes from "@/routes/DashboardRoutes";
import InvestingRoutes from "@/routes/InvestingRoutes";
import AccountRoutes from "@/routes/AccountRoutes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="stock-pilot-theme">
        <HelmetProvider>
          <BrowserRouter>
            <AuthProvider>
              <MobileMenu />
              <Routes>
                <Route path="/*" element={<PublicRoutes />} />
                <Route path="/*" element={<DashboardRoutes />} />
                <Route path="/*" element={<InvestingRoutes />} />
                <Route path="/*" element={<AccountRoutes />} />
              </Routes>
              <Toaster />
            </AuthProvider>
          </BrowserRouter>
        </HelmetProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
