import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, Briefcase, DollarSign, Bitcoin, ArrowRightLeft, 
  RefreshCw, BookText, FileText, Calculator, History, 
  Settings, HelpCircle, Keyboard, LogOut, Building 
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

const AccountSidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return 'U';
    
    const nameParts = user.user_metadata.full_name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0] || 'U';
  };

  const menuItems = [
    { icon: User, title: 'Profile', path: '/profile' },
    { icon: Briefcase, title: 'Investing', path: '/investing' },
    { icon: DollarSign, title: 'Spending', path: '/spending' },
    { icon: Bitcoin, title: 'Crypto', path: '/crypto' },
    { icon: ArrowRightLeft, title: 'Transfers', path: '/transfers' },
    { icon: RefreshCw, title: 'Recurring', path: '/recurring' },
    { icon: BookText, title: 'Stock Lending', path: '/stock-lending' },
    { icon: FileText, title: 'Reports and statements', path: '/reports-and-statements' },
    { icon: Calculator, title: 'Tax center', path: '/tax-center' },
    { icon: History, title: 'History', path: '/history' },
    { icon: Settings, title: 'Settings', path: '/settings' },
    { icon: HelpCircle, title: 'Help', path: '/help' },
    { icon: Keyboard, title: 'Keyboard Shortcuts', path: '/keyboard-shortcuts' }
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="sidebar" collapsible="offcanvas">
        <SidebarHeader className="flex flex-col items-start py-4">
          <div className="flex items-center px-4 py-2 w-full">
            <div className="w-8 h-8 mr-3 rounded-full bg-amber-500 flex items-center justify-center">
              <span className="text-amber-100 font-bold">SP</span>
            </div>
            <h2 className="text-lg font-semibold">StockPilot Gold</h2>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                  <Link to={item.path} className="flex items-center">
                    <item.icon className="mr-3" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t pt-4">
          {user && (
            <div className="px-4 py-2 mb-2">
              <div className="flex items-center mb-2">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
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
