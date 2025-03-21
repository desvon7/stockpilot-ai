
import { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Menu, Search } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import MobileMenu from "@/components/layout/MobileMenu";
import StockSearch from '@/components/ui/StockSearch';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <header className="fixed w-full z-50 top-0 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl">
          StockPilot
        </Link>

        {/* Main navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Theme switch */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {user && (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/stocks" className="nav-link">
                Browse Stocks
              </Link>
              <Link to="/watchlists" className="nav-link">
                Watchlists
              </Link>
              <Link to="/news" className="nav-link">
                News
              </Link>
            </>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(!showSearch)}
                className="rounded-full"
                aria-label="Search stocks"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          )}
          
          {!user && (
            <>
              <Link to="/auth" className="nav-link">
                Sign In
              </Link>
              <Link to="/auth" className="nav-link">
                Sign Up
              </Link>
            </>
          )}

          {/* Theme switch */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile menu */}
          <MobileMenu isOpen={showMobileMenu} setIsOpen={setShowMobileMenu} />
        </div>
      </div>
      
      {/* Global search bar */}
      {showSearch && (
        <div className="container mx-auto px-4 pb-4">
          <StockSearch darkMode={theme === 'dark'} />
        </div>
      )}
    </header>
  );
}

export default Navbar;
