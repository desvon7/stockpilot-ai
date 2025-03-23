
import React, { useState } from 'react';
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
  ChevronDown
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

const NavigationBar = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavItem = ({ to, label, className }: { to: string; label: string; className?: string }) => (
    <Link to={to} className={cn(
      "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
      isActive(to) ? "text-primary" : "text-white",
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

  return (
    <nav className="bg-black border-b border-gray-800 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-white" />
            <span className="font-bold text-xl text-white">StockPilot</span>
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
        
        <div>
          <DropdownMenu open={isAccountMenuOpen} onOpenChange={setIsAccountMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button 
                className={cn(
                  "flex items-center text-sm font-medium transition-colors",
                  isAccountMenuOpen ? "text-primary" : "text-white hover:text-primary"
                )}
              >
                <span className="mr-1">Account</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-64 bg-gray-900 border border-gray-800 text-white" 
              align="end"
            >
              {user ? (
                <>
                  <DropdownMenuLabel className="border-b border-gray-800 py-4">
                    <div className="font-bold text-lg">{user.email?.split('@')[0] || 'User'}</div>
                  </DropdownMenuLabel>
                  
                  <div className="flex items-center px-3 py-3 border-b border-gray-800">
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
                  
                  <DropdownMenuSeparator className="bg-gray-800" />
                  
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
