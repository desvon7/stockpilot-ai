
import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface ActivityItem {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'dividend';
  symbol?: string;
  amount: number;
  shares?: number;
  price?: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  if (!activities.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium flex items-center">
            <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            No recent activity to show
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium flex items-center">
          <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 
                  ${activity.type === 'buy' || activity.type === 'deposit' ? 'bg-green-100 dark:bg-green-900' : ''}
                  ${activity.type === 'sell' || activity.type === 'withdrawal' ? 'bg-red-100 dark:bg-red-900' : ''}
                  ${activity.type === 'dividend' ? 'bg-blue-100 dark:bg-blue-900' : ''}
                `}>
                  {activity.type === 'buy' && <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />}
                  {activity.type === 'sell' && <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />}
                  {activity.type === 'deposit' && <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />}
                  {activity.type === 'withdrawal' && <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />}
                  {activity.type === 'dividend' && <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                </div>
                <div>
                  <p className="font-medium">
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}{' '}
                    {activity.symbol && `${activity.symbol}`}{' '}
                    {activity.shares && `(${activity.shares} shares)`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString()} - {activity.status}
                  </p>
                </div>
              </div>
              <div className={`text-right font-medium ${
                activity.type === 'buy' || activity.type === 'withdrawal' ? 'text-red-600 dark:text-red-400' : 
                activity.type === 'sell' || activity.type === 'deposit' || activity.type === 'dividend' ? 'text-green-600 dark:text-green-400' : ''
              }`}>
                {activity.type === 'buy' || activity.type === 'withdrawal' ? '-' : '+'}
                ${activity.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
