
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useScrollProgress } from '@/utils/animations';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Sun, 
  Moon,
  Search,
  User,
  TrendingUp,
  Newspaper
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const scrollProgress = useScrollProgress();
  const { user } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Stocks', path: '/stocks', children: [
      { name: 'Browse Stocks', path: '/stocks' },
      { name: 'Trending Assets', path: '/trending-assets' },
      { name: 'News Feed', path: '/news-feed' },
    ] },
    { name: 'AI Advisor', path: '/advisor' },
    { name: 'Learn', path: '/learn' },
  ];
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'backdrop-blur-lg bg-background/80 shadow-sm' : 'bg-transparent'
    )}>
      {/* Progress bar */}
      <div 
        className="absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300"
        style={{ width: `${scrollProgress * 100}%` }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="bg-primary text-primary-foreground font-bold text-xl p-1 rounded">SP</span>
            <span className="font-medium text-xl hidden sm:block">StockPilot</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => 
              link.children ? (
                <NavigationMenu key={link.path}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger 
                        className={cn(
                          'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                          isActive(link.path)
                            ? 'bg-secondary text-foreground'
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        )}
                      >
                        {link.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 w-[200px]">
                          {link.children.map((child) => (
                            <li key={child.path}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={child.path}
                                  className={cn(
                                    'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                                    isActive(child.path) && 'bg-accent text-accent-foreground'
                                  )}
                                >
                                  <div className="text-sm font-medium leading-none">{child.name}</div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive(link.path)
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  {link.name}
                </Link>
              )
            )}
          </nav>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            <button
              className="p-2 rounded-full hover:bg-muted transition-colors"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Link 
              to={user ? "/dashboard" : "/auth"}
              className="hidden sm:flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <User size={16} />
              <span>{user ? 'Dashboard' : 'Sign In'}</span>
            </Link>
            
            {/* Mobile menu button */}
            <button
              className="p-2 md:hidden rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className={cn(
        'fixed inset-0 z-40 bg-background transition-all duration-300 ease-out-expo md:hidden',
        mobileMenuOpen 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 -translate-x-full pointer-events-none'
      )}>
        <div className="flex flex-col h-full pt-20 px-4 pb-6">
          <nav className="flex flex-col space-y-1 mt-6">
            {navLinks.map((link) => (
              <React.Fragment key={link.path}>
                <Link
                  to={link.path}
                  className={cn(
                    'px-4 py-3 rounded-md text-base font-medium transition-colors',
                    isActive(link.path)
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
                {link.children && (
                  <div className="pl-4 space-y-1 mt-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={cn(
                          'px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center',
                          isActive(child.path)
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <ChevronDown size={16} className="mr-2" />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </nav>
          
          <div className="mt-auto pt-6 border-t border-border">
            <Link 
              to={user ? "/dashboard" : "/auth"}
              className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-4 py-3 rounded-md text-base font-medium hover:bg-primary/90 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={18} />
              <span>{user ? 'Dashboard' : 'Sign In'}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
