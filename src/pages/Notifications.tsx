
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bell, TrendingUp, CreditCard, Bitcoin, Settings, Calendar, ChevronRight } from 'lucide-react';

const Notifications: React.FC = () => {
  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: 'market',
      title: 'Market is about to close',
      description: 'The US market will close in 30 minutes.',
      time: '3:30 PM',
      date: 'Today',
      read: false
    },
    {
      id: 2,
      type: 'account',
      title: 'Deposit completed',
      description: 'Your deposit of $500 has been completed.',
      time: '10:15 AM',
      date: 'Today',
      read: true
    },
    {
      id: 3,
      type: 'stock',
      title: 'Price alert: AAPL',
      description: 'Apple Inc. is up 3.2% today.',
      time: '11:45 AM',
      date: 'Yesterday',
      read: true
    },
    {
      id: 4,
      type: 'crypto',
      title: 'Bitcoin reaches new high',
      description: 'Bitcoin has reached $60,000 for the first time in months.',
      time: '8:20 AM',
      date: 'Yesterday',
      read: true
    }
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case 'market':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'account':
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case 'stock':
        return <TrendingUp className="h-5 w-5 text-amber-500" />;
      case 'crypto':
        return <Bitcoin className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Notifications | StockPilot</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Card key={notification.id} className={`p-4 bg-gray-900 border-gray-800 ${!notification.read ? 'border-l-4 border-l-green-500' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getIconForType(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        <div className="text-xs text-gray-400">
                          {notification.time} · {notification.date}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">{notification.description}</p>
                    </div>
                    {!notification.read && (
                      <Badge className="bg-green-500 text-xs">New</Badge>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <Bell className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-1">No notifications</h3>
                <p className="text-gray-400">You're all caught up!</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="account">
            <div className="text-center py-10">
              <CreditCard className="h-12 w-12 mx-auto text-gray-600 mb-4" />
              <h3 className="text-lg font-medium mb-1">No account notifications</h3>
              <p className="text-gray-400">Account alerts will appear here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="market">
            <Card className="p-4 bg-gray-900 border-gray-800 border-l-4 border-l-blue-500">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">Market is about to close</h3>
                    <div className="text-xs text-gray-400">
                      3:30 PM · Today
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">The US market will close in 30 minutes.</p>
                </div>
                <Badge className="bg-green-500 text-xs">New</Badge>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="crypto">
            <Card className="p-4 bg-gray-900 border-gray-800">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Bitcoin className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">Bitcoin reaches new high</h3>
                    <div className="text-xs text-gray-400">
                      8:20 AM · Yesterday
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">Bitcoin has reached $60,000 for the first time in months.</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Notification Settings</h2>
          </div>
          
          <Card className="bg-gray-900 border-gray-800 divide-y divide-gray-800">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-gray-400" />
                <span>Market notifications</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span>Earnings reminders</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <span>Account activity</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bitcoin className="h-5 w-5 text-gray-400" />
                <span>Crypto alerts</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Notifications;
