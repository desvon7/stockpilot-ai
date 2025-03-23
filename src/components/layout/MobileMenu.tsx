
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import GlobalAssetSearch from '@/components/search/GlobalAssetSearch';

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
    <div className="md:hidden fixed bottom-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="icon" className="rounded-full shadow-lg">
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
            
            <div className="px-4">
              <GlobalAssetSearch 
                darkMode={theme === 'dark'}
                trigger={
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    <div className="flex items-center">
                      <Search className="w-4 h-4 mr-2" />
                      <span className="text-sm">Search assets...</span>
                    </div>
                  </Button>
                }
              />
            </div>
            
            <div className="space-y-1">
              {user ? (
                <>
                  <Link to="/dashboard" className="mobile-nav-link">
                    Dashboard
                  </Link>
                  <Link to="/rewards" className="mobile-nav-link">
                    Rewards
                  </Link>
                  <Link to="/investing" className="mobile-nav-link">
                    Investing
                  </Link>
                  <Link to="/crypto" className="mobile-nav-link">
                    Crypto
                  </Link>
                  <Link to="/spending" className="mobile-nav-link">
                    Spending
                  </Link>
                  <Link to="/retirement" className="mobile-nav-link">
                    Retirement
                  </Link>
                  <Link to="/notifications" className="mobile-nav-link">
                    Notifications
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
            
            <div className="flex items-center px-4 py-2">
              <span className="text-sm mr-2">{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-primary"
                />
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </div>
            </div>
            
            {user && (
              <Button variant="destructive" size="sm" className="mx-4" onClick={handleSignOut}>
                Sign Out
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
export { MobileMenu };
