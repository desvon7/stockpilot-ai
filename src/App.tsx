
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from "react-helmet-async";
import NavigationBar from "@/components/layout/NavigationBar";
import MobileMenu from "@/components/layout/MobileMenu";
import AppRoutes from "./routes/AppRoutes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <HelmetProvider>
          <BrowserRouter>
            <AuthProvider>
              <div className="min-h-screen bg-background text-foreground flex flex-col">
                <AppRoutes />
                <MobileMenu />
                <Toaster />
              </div>
            </AuthProvider>
          </BrowserRouter>
        </HelmetProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
