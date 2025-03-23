
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Menu, X, User, Settings, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

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

  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return 'U';
    
    const nameParts = user.user_metadata.full_name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0] || 'U';
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80vw] max-w-[300px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center">
              <div className="w-8 h-8 mr-3 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-amber-100 font-bold">SP</span>
              </div>
              <span>StockPilot</span>
            </SheetTitle>
            <SheetDescription className="text-sm">
              Your personal stock portfolio tracker
            </SheetDescription>
          </SheetHeader>
          
          {user && (
            <div className="p-4 border-b">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{user.user_metadata?.full_name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto py-2">
            <nav className="space-y-1 px-2">
              {user ? (
                <>
                  <SheetClose asChild>
                    <Link to="/dashboard" className="flex items-center px-3 py-2 rounded-md hover:bg-muted/50 transition-colors">
                      <Home className="mr-3 h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/stocks" className="flex items-center px-3 py-2 rounded-md hover:bg-muted/50 transition-colors">
                      <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 13.125C3 12.5727 3.44772 12.125 4 12.125H6C6.55228 12.125 7 12.5727 7 13.125V20.125H3V13.125Z" className="fill-current" />
                        <path d="M10 8.125C10 7.57272 10.4477 7.125 11 7.125H13C13.5523 7.125 14 7.57272 14 8.125V20.125H10V8.125Z" className="fill-current" />
                        <path d="M17 3.125C17 2.57272 17.4477 2.125 18 2.125H20C20.5523 2.125 21 2.57272 21 3.125V20.125H17V3.125Z" className="fill-current" />
                      </svg>
                      <span>Browse Stocks</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/watchlists" className="flex items-center px-3 py-2 rounded-md hover:bg-muted/50 transition-colors">
                      <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 4H5C4.44772 4 4 4.44772 4 5V9C4 9.55228 4.44772 10 5 10H9C9.55228 10 10 9.55228 10 9V5C10 4.44772 9.55228 4 9 4Z" className="fill-current" />
                        <path d="M9 14H5C4.44772 14 4 14.4477 4 15V19C4 19.5523 4.44772 20 5 20H9C9.55228 20 10 19.5523 10 19V15C10 14.4477 9.55228 14 9 14Z" className="fill-current" />
                        <path d="M19 4H15C14.4477 4 14 4.44772 14 5V9C14 9.55228 14.4477 10 15 10H19C19.5523 10 20 9.55228 20 9V5C20 4.44772 19.5523 4 19 4Z" className="fill-current" />
                        <path d="M19 14H15C14.4477 14 14 14.4477 14 15V19C14 19.5523 14.4477 20 15 20H19C19.5523 20 20 19.5523 20 19V15C20 14.4477 19.5523 14 19 14Z" className="fill-current" />
                      </svg>
                      <span>Watchlists</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/news" className="flex items-center px-3 py-2 rounded-md hover:bg-muted/50 transition-colors">
                      <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 5V19H5V5H19ZM21 3H3V21H21V3ZM17 17H7V16H17V17ZM17 15H7V14H17V15ZM17 12H7V7H17V12Z" className="fill-current" />
                      </svg>
                      <span>News Feed</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/profile" className="flex items-center px-3 py-2 rounded-md hover:bg-muted/50 transition-colors">
                      <User className="mr-3 h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/settings" className="flex items-center px-3 py-2 rounded-md hover:bg-muted/50 transition-colors">
                      <Settings className="mr-3 h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                  </SheetClose>
                </>
              ) : (
                <>
                  <SheetClose asChild>
                    <Link to="/" className="flex items-center px-3 py-2 rounded-md hover:bg-muted/50 transition-colors">
                      <Home className="mr-3 h-5 w-5" />
                      <span>Home</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/auth" className="flex items-center px-3 py-2 rounded-md hover:bg-muted/50 transition-colors">
                      <User className="mr-3 h-5 w-5" />
                      <span>Sign In / Sign Up</span>
                    </Link>
                  </SheetClose>
                </>
              )}
            </nav>
          </div>
          
          <div className="p-4 border-t mt-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start gap-2 mb-2" 
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-4 w-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  Dark Mode
                </>
              )}
            </Button>
            
            {user && (
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full" 
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
export { MobileMenu };
