
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  BarChart2, 
  DollarSign, 
  Award, 
  Briefcase,
  Bitcoin,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  User,
  Moon,
  Sun,
  Search
} from 'lucide-react';
import GlobalAssetSearch from '@/components/search/GlobalAssetSearch';
import { cn } from '@/lib/utils';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/home', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Investing', path: '/investing', icon: <BarChart2 className="w-4 h-4 mr-2" /> },
    { name: 'Spending', path: '/spending', icon: <DollarSign className="w-4 h-4 mr-2" /> },
    { name: 'Rewards', path: '/rewards', icon: <Award className="w-4 h-4 mr-2" /> },
    { name: 'Retirement', path: '/retirement', icon: <Briefcase className="w-4 h-4 mr-2" /> },
    { name: 'Crypto', path: '/crypto', icon: <Bitcoin className="w-4 h-4 mr-2" /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell className="w-4 h-4 mr-2" /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg hidden md:inline-block">StockPilot</span>
          </Link>
        </div>
        
        {user && (
          <nav className="mx-6 flex items-center space-x-1 md:space-x-2 lg:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "nav-link flex items-center",
                  isActive(item.path) && "active"
                )}
              >
                {item.icon}
                <span className="hidden md:inline-block">{item.name}</span>
              </Link>
            ))}
          </nav>
        )}
        
        <div className="ml-auto flex items-center space-x-2">
          {user && (
            <GlobalAssetSearch 
              darkMode={theme === 'dark'}
              trigger={
                <Button variant="ghost" size="icon" className="mr-2">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              }
            />
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="mr-2"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" alt={user.email || "User avatar"} />
                    <AvatarFallback>{user.email?.[0].toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/help')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate('/auth/login')}>Sign In</Button>
              <Button onClick={() => navigate('/auth/register')}>Sign Up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
