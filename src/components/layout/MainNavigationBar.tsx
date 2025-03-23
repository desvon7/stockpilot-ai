
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  DollarSign,
  BarChart2,
  Briefcase,
  Sun,
  Moon,
  ChevronDown,
  PanelLeft
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import GlobalAssetSearch from '@/components/search/GlobalAssetSearch';

const MainNavigationBar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isDarkMode = theme === 'dark';
  
  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart2 className="w-4 h-4" /> },
    { name: 'Investing', path: '/investing', icon: <DollarSign className="w-4 h-4" /> },
    { name: 'Retirement', path: '/retirement', icon: <Briefcase className="w-4 h-4" /> },
  ];
  
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };
  
  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo & Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <button 
            className="block lg:hidden" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <Link to="/" className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <span className="hidden font-bold text-lg sm:inline-block">StockPilot</span>
          </Link>
        </div>
        
        {/* Main Navigation - Desktop */}
        <nav className="hidden mx-4 lg:flex items-center space-x-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1",
                isActive(item.path) 
                  ? "bg-primary/10 text-primary" 
                  : "text-foreground/70 hover:text-foreground hover:bg-accent"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="px-3 py-2 text-foreground/70 hover:text-foreground">
                <span className="flex items-center">
                  More <ChevronDown className="ml-1 h-4 w-4" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/crypto" className="cursor-pointer">Cryptocurrency</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/stocks" className="cursor-pointer">Stock Browser</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/watchlists" className="cursor-pointer">Watchlists</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/news" className="cursor-pointer">Financial News</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        
        {/* Right Side Icons */}
        <div className="flex items-center space-x-2">
          <GlobalAssetSearch 
            darkMode={isDarkMode}
            trigger={
              <Button variant="ghost" size="icon" className="text-foreground/70">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            }
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-foreground/70"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="text-foreground/70">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              
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
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation Drawer */}
      <div className={cn(
        "lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-200",
        isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className={cn(
          "fixed left-0 top-0 bottom-0 w-3/4 max-w-xs bg-background border-r border-border h-full transition-transform duration-200 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
              <Link to="/" className="flex items-center space-x-2">
                <DollarSign className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">StockPilot</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                <PanelLeft className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-auto py-2 space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium w-full",
                    isActive(item.path) 
                      ? "bg-primary/10 text-primary" 
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              
              <div className="pt-2 pb-2 border-t border-border mt-2">
                <p className="px-3 py-1 text-xs font-medium text-muted-foreground">More</p>
              </div>
              
              <Link 
                to="/crypto"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium w-full text-foreground/70 hover:text-foreground hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Cryptocurrency</span>
              </Link>
              
              <Link 
                to="/stocks"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium w-full text-foreground/70 hover:text-foreground hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Stock Browser</span>
              </Link>
              
              <Link 
                to="/watchlists"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium w-full text-foreground/70 hover:text-foreground hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Watchlists</span>
              </Link>
              
              <Link 
                to="/news"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium w-full text-foreground/70 hover:text-foreground hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Financial News</span>
              </Link>
            </div>
            
            <div className="pt-4 border-t border-border">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar.png" alt={user.email || "User"} />
                      <AvatarFallback>{user.email?.[0].toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" className="w-full" onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/auth/login">Sign In</Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link to="/auth/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNavigationBar;
