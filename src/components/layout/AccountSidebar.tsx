
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, Briefcase, DollarSign, Bitcoin, ArrowRightLeft, 
  RefreshCw, BookText, FileText, Calculator, History, 
  Settings, HelpCircle, Keyboard, LogOut 
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

  // Get the user's initials for the avatar fallback
  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return 'U';
    
    const nameParts = user.user_metadata.full_name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0] || 'U';
  };

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
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/profile" className="flex items-center">
                  <User className="mr-3" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/investing" className="flex items-center">
                  <Briefcase className="mr-3" />
                  <span>Investing</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/spending" className="flex items-center">
                  <DollarSign className="mr-3" />
                  <span>Spending</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/crypto" className="flex items-center">
                  <Bitcoin className="mr-3" />
                  <span>Crypto</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/transfers" className="flex items-center">
                  <ArrowRightLeft className="mr-3" />
                  <span>Transfers</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/recurring" className="flex items-center">
                  <RefreshCw className="mr-3" />
                  <span>Recurring</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/stock-lending" className="flex items-center">
                  <BookText className="mr-3" />
                  <span>Stock Lending</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/reports" className="flex items-center">
                  <FileText className="mr-3" />
                  <span>Reports and statements</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/tax" className="flex items-center">
                  <Calculator className="mr-3" />
                  <span>Tax center</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/history" className="flex items-center">
                  <History className="mr-3" />
                  <span>History</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/settings" className="flex items-center">
                  <Settings className="mr-3" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/help" className="flex items-center">
                  <HelpCircle className="mr-3" />
                  <span>Help</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/keyboard-shortcuts" className="flex items-center">
                  <Keyboard className="mr-3" />
                  <span>Keyboard Shortcuts</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
