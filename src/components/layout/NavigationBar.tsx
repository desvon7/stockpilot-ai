
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { 
  LayoutDashboard, 
  TrendingUp, 
  PieChart, 
  ArrowDownUp, 
  FileText, 
  Bell, 
  Settings, 
  LogOut, 
  User,
  Sun,
  Moon,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const NavigationBar = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="bg-background border-b border-border py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">StockPilot</span>
          </Link>
          
          {user && (
            <div className="hidden md:flex space-x-6">
              <Link to="/dashboard" className={cn("flex items-center space-x-1 text-sm hover:text-primary transition-colors", 
                isActive('/dashboard') && "text-primary font-semibold")}>
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link to="/stocks" className={cn("flex items-center space-x-1 text-sm hover:text-primary transition-colors", 
                isActive('/stocks') && "text-primary font-semibold")}>
                <TrendingUp className="h-4 w-4" />
                <span>Stocks</span>
              </Link>
              
              <Link to="/watchlists" className={cn("flex items-center space-x-1 text-sm hover:text-primary transition-colors", 
                isActive('/watchlists') && "text-primary font-semibold")}>
                <Bell className="h-4 w-4" />
                <span>Watchlists</span>
              </Link>
              
              <Link to="/transactions" className={cn("flex items-center space-x-1 text-sm hover:text-primary transition-colors", 
                isActive('/transactions') && "text-primary font-semibold")}>
                <ArrowDownUp className="h-4 w-4" />
                <span>Transactions</span>
              </Link>
              
              <Link to="/news" className={cn("flex items-center space-x-1 text-sm hover:text-primary transition-colors", 
                isActive('/news') && "text-primary font-semibold")}>
                <FileText className="h-4 w-4" />
                <span>News</span>
              </Link>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-foreground">
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="hidden md:flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{user.email?.split('@')[0] || 'User'}</span>
              </Link>
              
              <Button variant="outline" size="sm" onClick={signOut} className="hidden md:flex">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sign Out</span>
              </Button>
              
              {/* Mobile menu trigger */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/auth">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
