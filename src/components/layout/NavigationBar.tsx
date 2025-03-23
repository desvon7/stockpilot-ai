
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { 
  TrendingUp, 
  CreditCard,
  Bitcoin,
  ArrowLeftRight,
  RefreshCw,
  HandCoins,
  FileText,
  FileBarChart,
  History,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  User,
  LogOut,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  const NavItem = ({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) => (
    <Link to={to} className={cn(
      "text-sm font-medium transition-colors hover:text-primary",
      isActive(to) ? "text-green-400 underline-offset-4 underline" : "text-gray-200"
    )}>
      {label}
    </Link>
  );

  return (
    <nav className="bg-black border-b border-gray-800 py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-white" />
            <span className="font-bold text-xl text-white">StockPilot</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <NavItem to="/investing" label="Investing" icon={<TrendingUp size={16} />} />
            <NavItem to="/spending" label="Spending" icon={<CreditCard size={16} />} />
            <NavItem to="/crypto" label="Crypto" icon={<Bitcoin size={16} />} />
            <NavItem to="/transfers" label="Transfers" icon={<ArrowLeftRight size={16} />} />
            <NavItem to="/recurring" label="Recurring" icon={<RefreshCw size={16} />} />
            <NavItem to="/stock-lending" label="Stock Lending" icon={<HandCoins size={16} />} />
            <NavItem to="/reports-and-statements" label="Reports and statements" icon={<FileText size={16} />} />
            <NavItem to="/tax-center" label="Tax center" icon={<FileBarChart size={16} />} />
            <NavItem to="/history" label="History" icon={<History size={16} />} />
            <NavItem to="/settings" label="Settings" icon={<Settings size={16} />} />
            <NavItem to="/help" label="Help" icon={<HelpCircle size={16} />} />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-white">
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="hidden md:flex items-center space-x-2 text-white">
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">{user.email?.split('@')[0] || 'User'}</span>
              </Link>
              
              <Button variant="outline" size="sm" onClick={signOut} className="hidden md:flex text-white border-gray-700 hover:bg-gray-800">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sign Out</span>
              </Button>
              
              {/* Mobile menu trigger */}
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/auth">
                <Button variant="outline" size="sm" className="text-white border-gray-700 hover:bg-gray-800">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
