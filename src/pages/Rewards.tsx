
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Gift, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

const Rewards: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <Helmet>
        <title>Rewards | StockPilot</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Rewards</h1>
          <Button variant="outline" className="text-primary border-primary">
            <Gift className="mr-2 h-4 w-4" />
            Share and earn
          </Button>
        </div>
        
        <div className={cn(
          "rounded-xl p-6 mb-10",
          "bg-gradient-to-r from-amber-600 to-amber-400"
        )}>
          <div className="flex items-center mb-4">
            <Award className="h-8 w-8 text-white mr-3" />
            <h2 className="text-2xl font-bold text-white">StockPilot Gold</h2>
          </div>
          <p className="text-white/90 mb-6">Earn rewards with every trade and unlock exclusive benefits</p>
          <Button className="bg-white text-amber-600 hover:bg-gray-100">View Benefits</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card className={isDark ? "bg-gray-900 border-gray-800" : ""}>
            <CardHeader>
              <CardTitle>Free Stock</CardTitle>
              <CardDescription>Invite friends to get free stocks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">$0</div>
              <p className="text-gray-400">Earned so far</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full justify-between">
                Invite Friends <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className={isDark ? "bg-gray-900 border-gray-800" : ""}>
            <CardHeader>
              <CardTitle>Cashback</CardTitle>
              <CardDescription>Earn on eligible purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">$0</div>
              <p className="text-gray-400">Earned this month</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full justify-between">
                View Offers <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className={isDark ? "bg-gray-900 border-gray-800" : ""}>
            <CardHeader>
              <CardTitle>Daily Rewards</CardTitle>
              <CardDescription>Check in daily for bonuses</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center pb-6">
              <Button size="lg" className="bg-green-500 hover:bg-green-600">
                <Sparkles className="mr-2 h-5 w-5" /> Claim Daily Reward
              </Button>
            </CardContent>
            <CardFooter className="text-center text-sm text-gray-400">
              <Calendar className="inline mr-2 h-4 w-4" /> Next reward in 24 hours
            </CardFooter>
          </Card>
        </div>
        
        <h2 className="text-xl font-bold mb-4">Reward History</h2>
        <div className={cn(
          "rounded-lg p-6 text-center",
          isDark ? "bg-gray-900 border border-gray-800" : "bg-card border border-border"
        )}>
          <div className="flex flex-col items-center justify-center py-10">
            <Gift className={cn("h-16 w-16 mb-4", isDark ? "text-gray-600" : "text-gray-300")} />
            <p className="text-gray-400 mb-2">No rewards earned yet</p>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Complete actions like inviting friends, making trades, or using your StockPilot card to earn rewards</p>
            <Button className="bg-green-500 hover:bg-green-600">Start Earning</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rewards;
