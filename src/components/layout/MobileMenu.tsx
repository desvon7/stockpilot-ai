
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun, Menu, Search, Home, BarChart2, DollarSign, Award, Briefcase, Bitcoin, Bell, Settings, HelpCircle, LogOut } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
          <Button size="icon" className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full max-w-[325px] sm:max-w-sm">
          <div className="flex flex-col h-full">
            <SheetHeader className="text-left pb-4 border-b border-border">
              <SheetTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span>StockPilot</span>
              </SheetTitle>
              <SheetDescription>
                Your personal stock portfolio tracker
              </SheetDescription>
            </SheetHeader>
            
            {user && (
              <div className="py-4 px-1 flex items-center space-x-3 border-b border-border">
                <Avatar>
                  <AvatarImage src="/avatar.png" alt={user.email || "User"} />
                  <AvatarFallback>{user.email?.[0].toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.email}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
            )}
            
            <div className="px-1 py-4">
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
            
            <nav className="flex-1 overflow-auto py-2">
              {user ? (
                <div className="space-y-1 px-1">
                  <NavLink to="/home" icon={<Home className="w-4 h-4 mr-3" />} label="Home" onClick={() => setIsOpen(false)} />
                  <NavLink to="/investing" icon={<BarChart2 className="w-4 h-4 mr-3" />} label="Investing" onClick={() => setIsOpen(false)} />
                  <NavLink to="/spending" icon={<DollarSign className="w-4 h-4 mr-3" />} label="Spending" onClick={() => setIsOpen(false)} />
                  <NavLink to="/rewards" icon={<Award className="w-4 h-4 mr-3" />} label="Rewards" onClick={() => setIsOpen(false)} />
                  <NavLink to="/retirement" icon={<Briefcase className="w-4 h-4 mr-3" />} label="Retirement" onClick={() => setIsOpen(false)} />
                  <NavLink to="/crypto" icon={<Bitcoin className="w-4 h-4 mr-3" />} label="Crypto" onClick={() => setIsOpen(false)} />
                  <NavLink to="/notifications" icon={<Bell className="w-4 h-4 mr-3" />} label="Notifications" onClick={() => setIsOpen(false)} />
                  
                  <div className="pt-4 mt-4 border-t border-border">
                    <NavLink to="/settings" icon={<Settings className="w-4 h-4 mr-3" />} label="Settings" onClick={() => setIsOpen(false)} />
                    <NavLink to="/help" icon={<HelpCircle className="w-4 h-4 mr-3" />} label="Help" onClick={() => setIsOpen(false)} />
                  </div>
                </div>
              ) : (
                <div className="space-y-1 px-1">
                  <NavLink to="/" icon={<Home className="w-4 h-4 mr-3" />} label="Home" onClick={() => setIsOpen(false)} />
                  <NavLink to="/auth/login" icon={<LogOut className="w-4 h-4 mr-3" />} label="Sign In" onClick={() => setIsOpen(false)} />
                  <NavLink to="/auth/register" icon={<LogOut className="w-4 h-4 mr-3" />} label="Sign Up" onClick={() => setIsOpen(false)} />
                </div>
              )}
            </nav>
            
            <div className="mt-auto pt-4 border-t border-border">
              <div className="flex items-center justify-between px-1 py-2">
                <div className="flex items-center">
                  {theme === 'dark' ? (
                    <Moon className="h-4 w-4 mr-2" />
                  ) : (
                    <Sun className="h-4 w-4 mr-2" />
                  )}
                  <span className="text-sm">{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              
              {user && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="mt-4 w-full"
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
    </div>
  );
};

const NavLink = ({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick?: () => void }) => {
  return (
    <Link 
      to={to} 
      className="flex items-center px-3 py-2 rounded-md hover:bg-secondary text-foreground"
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default MobileMenu;
