
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AccountSidebar from '@/components/layout/AccountSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { Bell, CreditCard, Smartphone, Moon, Settings, User } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isDarkMode, setIsDarkMode] = React.useState(
    window.document.documentElement.classList.contains('dark')
  );

  // Get the user's initials for the avatar fallback
  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return 'U';
    
    const nameParts = user.user_metadata.full_name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0] || 'U';
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    toast.success(`${newDarkMode ? 'Dark' : 'Light'} mode activated`);
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const fullName = formData.get('fullName') as string;
      
      if (!user) return;
      
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex mt-16">
        <AccountSidebar />
        <main className="flex-grow p-6">
          <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
          
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="mb-6 w-full max-w-md">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className={isMobile ? 'hidden' : 'inline'}>Account</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className={isMobile ? 'hidden' : 'inline'}>Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className={isMobile ? 'hidden' : 'inline'}>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span className={isMobile ? 'hidden' : 'inline'}>Mobile</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className={isMobile ? 'hidden' : 'inline'}>Payment</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Your personal details and account settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-6">
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-medium">{user?.user_metadata?.full_name || 'User'}</h3>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    
                    <form onSubmit={updateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          name="fullName" 
                          defaultValue={user?.user_metadata?.full_name || ''} 
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <Button type="submit">Update Profile</Button>
                    </form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                    <CardDescription>Your membership and verification status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800">
                        <h3 className="font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                          <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                          StockPilot Gold Member
                        </h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                          You have access to all premium features and benefits.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Email Verification</h4>
                        <p className="text-sm text-green-600 dark:text-green-400">Verified</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Account Type</h4>
                        <p className="text-sm">Premium</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Last Login</h4>
                        <p className="text-sm">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Display Preferences</CardTitle>
                  <CardDescription>Customize how StockPilot looks and feels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Switch between light and dark themes
                      </p>
                    </div>
                    <Switch 
                      id="dark-mode" 
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-view">Compact View</Label>
                      <p className="text-sm text-muted-foreground">
                        Display more information in less space
                      </p>
                    </div>
                    <Switch id="compact-view" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="animations">Reduced Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Minimize motion effects throughout the app
                      </p>
                    </div>
                    <Switch id="animations" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Control what notifications you receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="price-alerts">Price Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when stocks hit your target price
                      </p>
                    </div>
                    <Switch id="price-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="news-updates">News Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get important news about stocks in your portfolio
                      </p>
                    </div>
                    <Switch id="news-updates" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="trading-activity">Trading Activity</Label>
                      <p className="text-sm text-muted-foreground">
                        Be notified about order executions
                      </p>
                    </div>
                    <Switch id="trading-activity" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="market-summaries">Market Summaries</Label>
                      <p className="text-sm text-muted-foreground">
                        Daily and weekly market performance updates
                      </p>
                    </div>
                    <Switch id="market-summaries" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mobile">
              <Card>
                <CardHeader>
                  <CardTitle>Mobile App Settings</CardTitle>
                  <CardDescription>Manage your mobile app preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="biometric">Biometric Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Use fingerprint or face recognition to log in
                      </p>
                    </div>
                    <Switch id="biometric" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-saver">Data Saver Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce data usage when on cellular networks
                      </p>
                    </div>
                    <Switch id="data-saver" defaultChecked />
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-4">Mobile App Download</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="outline" className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.5227 12.0716C17.5367 9.5106 19.7047 8.1346 19.7887 8.0806C18.5047 6.1906 16.5047 5.9406 15.8087 5.9206C14.0347 5.7376 12.3307 6.9456 11.4247 6.9456C10.5077 6.9456 9.1337 5.9376 7.6477 5.9686C5.7687 5.9986 4.0187 7.0346 3.0457 8.6636C1.0437 11.9806 2.5787 17.0266 4.5027 19.5386C5.4647 20.7666 6.5987 22.1546 8.0737 22.0936C9.5087 22.0286 10.0657 21.1556 11.8167 21.1556C13.5557 21.1556 14.0797 22.0936 15.5727 22.0546C17.1067 22.0276 18.0877 20.8196 19.0147 19.5806C20.1157 18.1366 20.5587 16.7196 20.5767 16.6516C20.5407 16.6406 17.5067 15.4906 17.5227 12.0716Z" fill="currentColor"/>
                          <path d="M15.058 4.856C15.858 3.856 16.398 2.506 16.248 1.136C15.098 1.186 13.658 1.896 12.838 2.876C12.098 3.746 11.448 5.136 11.618 6.466C12.908 6.566 14.238 5.836 15.058 4.856Z" fill="currentColor"/>
                        </svg>
                        iOS App
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.5227 21.5H6.47773C5.37873 21.5 4.48373 20.605 4.48373 19.506V4.494C4.48373 3.395 5.37873 2.5 6.47773 2.5H17.5217C18.6207 2.5 19.5157 3.395 19.5157 4.494V19.506C19.5167 20.605 18.6217 21.5 17.5227 21.5Z" fill="currentColor"/>
                          <path d="M9.55472 11L15.4437 7.38V14.62L9.55472 11Z" fill="white"/>
                        </svg>
                        Android App
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment and billing information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-card border rounded-md">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="mr-4 p-2 bg-muted rounded">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/24</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">Add Payment Method</Button>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-sm font-medium mb-4">Billing History</h3>
                    <div className="text-center text-sm text-muted-foreground py-6">
                      <p>No billing history available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
