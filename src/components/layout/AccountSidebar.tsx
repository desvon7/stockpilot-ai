
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, Briefcase, DollarSign, Bitcoin, ArrowRightLeft, 
  RefreshCw, BookText, FileText, Calculator, History, 
  Settings, HelpCircle, Keyboard, LogOut, Building, Home
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AccountSidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return 'U';
    
    const nameParts = user.user_metadata.full_name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0] || 'U';
  };

  // Update paths to work with our routing structure
  const menuItems = [
    { icon: Home, title: 'Home', path: '/account/home' },
    { icon: User, title: 'Profile', path: '/account/profile' },
    { icon: Briefcase, title: 'Investing', path: '/account/investing' },
    { icon: DollarSign, title: 'Spending', path: '/account/spending' },
    { icon: Bitcoin, title: 'Crypto', path: '/account/crypto' },
    { icon: ArrowRightLeft, title: 'Transfers', path: '/account/transfers' },
    { icon: RefreshCw, title: 'Recurring', path: '/account/recurring' },
    { icon: BookText, title: 'Stock Lending', path: '/account/stock-lending' },
    { icon: FileText, title: 'Reports and statements', path: '/account/reports-and-statements' },
    { icon: Calculator, title: 'Tax center', path: '/account/tax-center' },
    { icon: History, title: 'History', path: '/account/history' },
    { icon: Settings, title: 'Settings', path: '/account/settings' },
    { icon: HelpCircle, title: 'Help', path: '/account/help' },
    { icon: Keyboard, title: 'Keyboard Shortcuts', path: '/account/keyboard-shortcuts' }
  ];

  // Get the current path for active state
  const currentPath = location.pathname;

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <SidebarProvider defaultOpen={isOpen}>
      <Sidebar 
        variant="sidebar" 
        collapsible={isMobile ? "offcanvas" : "icon"}
        className={cn(
          "border-r border-border",
          isOpen ? "w-64" : "w-[70px]"
        )}
      >
        <SidebarHeader className="flex flex-col items-start py-4">
          <div 
            onClick={() => handleNavigation('/account/home')} 
            className="flex items-center px-4 py-2 w-full hover:bg-muted/50 rounded-md cursor-pointer"
          >
            <div className="w-8 h-8 mr-3 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">SP</span>
            </div>
            <h2 className="text-lg font-semibold">StockPilot</h2>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={currentPath === item.path || 
                    (item.path !== '/account/home' && currentPath.startsWith(item.path))}
                  onClick={() => handleNavigation(item.path)}
                >
                  <div className="flex items-center cursor-pointer">
                    <item.icon className="mr-3 h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t pt-4">
          {user && (
            <div className="px-4 py-2 mb-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center mb-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[150px]">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('/account/profile')}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('/account/settings')}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('/account/home')}
                    className="cursor-pointer"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button 
                onClick={() => signOut()} 
                className="flex items-center w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
};

export default AccountSidebar;
