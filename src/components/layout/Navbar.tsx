
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Menu, Search, User } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import MobileMenu from "@/components/layout/MobileMenu";
import GlobalAssetSearch from '@/components/search/GlobalAssetSearch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return 'U';
    
    const nameParts = user.user_metadata.full_name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0] || 'U';
  };

  return (
    <header className={`fixed w-full z-50 top-0 bg-background/80 backdrop-blur-md transition-all duration-200 ${isScrolled ? 'border-b shadow-sm' : ''}`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl">
          StockPilot
        </Link>

        {/* Global Search - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <GlobalAssetSearch darkMode={theme === 'dark'} />
        </div>

        {/* Main navigation */}
        <nav className="hidden md:flex items-center gap-6">
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
        <div className="flex items-center gap-2">
          {/* Search button - Mobile */}
          <div className="md:hidden">
            <GlobalAssetSearch 
              darkMode={theme === 'dark'}
              trigger={
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Search className="h-5 w-5" />
                </Button>
              }
            />
          </div>
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-red-500">
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Mobile menu panel */}
      <MobileMenu isOpen={showMobileMenu} setIsOpen={setShowMobileMenu} />
    </header>
  );
}

export default Navbar;
