
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
import NotFound from "@/pages/NotFound";

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
                {/* Public Routes */}
                <Route path="/" element={<PublicRoutes />} />
                <Route path="/auth" element={<PublicRoutes />} />
                <Route path="/reset-password" element={<PublicRoutes />} />
                <Route path="/update-password" element={<PublicRoutes />} />
                <Route path="/home" element={<PublicRoutes />} />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard/*" element={<DashboardRoutes />} />
                <Route path="/profile/*" element={<DashboardRoutes />} />
                <Route path="/watchlists/*" element={<DashboardRoutes />} />
                <Route path="/stocks/*" element={<DashboardRoutes />} />
                <Route path="/portfolio/*" element={<DashboardRoutes />} />
                <Route path="/news/*" element={<DashboardRoutes />} />
                <Route path="/transactions/*" element={<DashboardRoutes />} />
                <Route path="/trending/*" element={<DashboardRoutes />} />
                
                {/* Investing Routes */}
                <Route path="/investing/*" element={<InvestingRoutes />} />
                <Route path="/spending/*" element={<InvestingRoutes />} />
                <Route path="/crypto/*" element={<InvestingRoutes />} />
                <Route path="/transfers/*" element={<InvestingRoutes />} />
                <Route path="/recurring/*" element={<InvestingRoutes />} />
                <Route path="/stock-lending/*" element={<InvestingRoutes />} />
                
                {/* Account Routes */}
                <Route path="/reports-and-statements/*" element={<AccountRoutes />} />
                <Route path="/tax-center/*" element={<AccountRoutes />} />
                <Route path="/history/*" element={<AccountRoutes />} />
                <Route path="/settings/*" element={<AccountRoutes />} />
                <Route path="/help/*" element={<AccountRoutes />} />
                <Route path="/keyboard-shortcuts/*" element={<AccountRoutes />} />
                
                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
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
