
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { 
  Award,
  TrendingUp, 
  Bitcoin,
  CreditCard,
  Building,
  Bell,
  User,
  ArrowLeftRight,
  RefreshCw,
  BookText,
  FileText,
  Calculator,
  History,
  Settings,
  HelpCircle,
  Keyboard,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import GlobalAssetSearch from '@/components/search/GlobalAssetSearch';

const NavigationBar = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavItem = ({ to, label, className }: { to: string; label: string; className?: string }) => (
    <Link to={to} className={cn(
      "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
      isActive(to) ? "text-primary" : "text-foreground",
      className
    )}>
      {label}
    </Link>
  );

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const accountMenuItems = [
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: TrendingUp, label: 'Investing', path: '/investing' },
    { icon: CreditCard, label: 'Spending', path: '/spending' },
    { icon: Bitcoin, label: 'Crypto', path: '/crypto' },
    { icon: ArrowLeftRight, label: 'Transfers', path: '/transfers' },
    { icon: RefreshCw, label: 'Recurring', path: '/recurring' },
    { icon: BookText, label: 'Stock Lending', path: '/stock-lending' },
    { icon: FileText, label: 'Reports and statements', path: '/reports-and-statements' },
    { icon: Calculator, label: 'Tax center', path: '/tax-center' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
    { icon: Keyboard, label: 'Keyboard Shortcuts', path: '/keyboard-shortcuts' }
  ];

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className={cn(
      "border-b py-4",
      theme === 'dark' ? "bg-black border-gray-800" : "bg-white border-gray-200"
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <TrendingUp className={cn("h-6 w-6", theme === 'dark' ? "text-white" : "text-black")} />
            <span className={cn("font-bold text-xl", theme === 'dark' ? "text-white" : "text-black")}>StockPilot</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <NavItem to="/rewards" label="Rewards" />
            <NavItem to="/investing" label="Investing" />
            <NavItem to="/crypto" label="Crypto" />
            <NavItem to="/spending" label="Spending" />
            <NavItem to="/retirement" label="Retirement" />
            <NavItem to="/notifications" label="Notifications" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Global Asset Search */}
          <div className="hidden md:block w-64">
            <GlobalAssetSearch 
              darkMode={theme === 'dark'}
              trigger={
                <Button variant="outline" className="w-full flex justify-between items-center relative">
                  <div className="flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    <span className="text-sm">Search assets...</span>
                  </div>
                  <kbd className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </Button>
              }
            />
          </div>
          
          {/* Theme Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={handleThemeToggle}
              className="data-[state=checked]:bg-primary"
            />
            {theme === 'dark' ? (
              <Moon className="h-4 w-4 text-gray-300" />
            ) : (
              <Sun className="h-4 w-4 text-yellow-500" />
            )}
          </div>
          
          {/* Account Dropdown */}
          <DropdownMenu open={isAccountMenuOpen} onOpenChange={setIsAccountMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button 
                className={cn(
                  "flex items-center text-sm font-medium transition-colors",
                  isAccountMenuOpen ? "text-primary" : "hover:text-primary"
                )}
              >
                <span className="mr-1">Account</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className={cn(
                "w-64 border text-foreground", 
                theme === 'dark' ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
              )} 
              align="end"
            >
              {user ? (
                <>
                  <DropdownMenuLabel className={cn(
                    "border-b py-4",
                    theme === 'dark' ? "border-gray-800" : "border-gray-200"
                  )}>
                    <div className="font-bold text-lg">{user.email?.split('@')[0] || 'User'}</div>
                  </DropdownMenuLabel>
                  
                  <div className={cn(
                    "flex items-center px-3 py-3 border-b",
                    theme === 'dark' ? "border-gray-800" : "border-gray-200"
                  )}>
                    <Award className="h-5 w-5 text-amber-500 mr-3" />
                    <span>StockPilot Gold</span>
                  </div>
                  
                  {accountMenuItems.map(item => (
                    <DropdownMenuItem key={item.path} asChild className="py-3 px-3 cursor-pointer">
                      <Link to={item.path} className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuSeparator className={theme === 'dark' ? "bg-gray-800" : "bg-gray-200"} />
                  
                  <DropdownMenuItem onClick={signOut} className="py-3 px-3 cursor-pointer">
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="font-bold">Account</DropdownMenuLabel>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/auth" className="flex items-center">
                      <User className="h-5 w-5 mr-3" />
                      <span>Sign In</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/auth" className="flex items-center">
                      <User className="h-5 w-5 mr-3" />
                      <span>Sign Up</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
