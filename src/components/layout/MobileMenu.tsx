
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen: propIsOpen, setIsOpen: propSetIsOpen }) => {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : localIsOpen;
  const setIsOpen = propSetIsOpen || setLocalIsOpen;
  
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 py-4">
          <SheetHeader>
            <SheetTitle>StockPilot</SheetTitle>
            <SheetDescription>
              Your personal stock portfolio tracker
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-1">
            {user ? (
              <>
                <Link to="/dashboard" className="mobile-nav-link">
                  Dashboard
                </Link>
                <Link to="/stocks" className="mobile-nav-link">
                  Browse Stocks
                </Link>
                <Link to="/watchlists" className="mobile-nav-link">
                  Watchlists
                </Link>
                <Link to="/news" className="mobile-nav-link">
                  News Feed
                </Link>
                <Link to="/transactions" className="mobile-nav-link">
                  Transactions
                </Link>
                <Link to="/trending" className="mobile-nav-link">
                  Trending Assets
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="mobile-nav-link">
                  Home
                </Link>
                <Link to="/auth" className="mobile-nav-link">
                  Sign In / Sign Up
                </Link>
              </>
            )}
          </div>
          
          <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4" />
                Light
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                Dark
              </>
            )}
          </Button>
          
          {user && (
            <Button variant="destructive" size="sm" className="w-full" onClick={handleSignOut}>
              Sign Out
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
export { MobileMenu };
