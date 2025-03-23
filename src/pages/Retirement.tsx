
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Info, PlusCircle, Sigma, TrendingUp } from 'lucide-react';

const Retirement: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Retirement | StockPilot</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Retirement</h1>
          <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Account
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Traditional IRA
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Tax-Deferred</Badge>
              </CardTitle>
              <CardDescription>Long-term retirement savings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">$24,876.42</div>
              <div className="text-sm text-muted-foreground mb-4">+$1,432.18 (5.8%) all time</div>
              <Button className="w-full">Manage Account</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Roth IRA
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Tax-Free Growth</Badge>
              </CardTitle>
              <CardDescription>Tax-free withdrawals in retirement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">$18,453.19</div>
              <div className="text-sm text-muted-foreground mb-4">+$2,104.57 (11.4%) all time</div>
              <Button className="w-full">Manage Account</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Retirement Overview</CardTitle>
              <CardDescription>Summary of your retirement accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">2023 IRA Contribution</span>
                    <span className="text-sm font-medium">$3,500 / $6,500</span>
                  </div>
                  <Progress value={53.8} max={100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Retirement Goal</span>
                    <span className="text-sm font-medium">$43,329 / $1.2M</span>
                  </div>
                  <Progress value={3.6} max={100} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="ghost" className="w-full flex justify-between items-center">
                <span>Retirement Calculator</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Contributions</CardTitle>
              <CardDescription>Scheduled retirement account deposits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <div className="font-medium">Traditional IRA</div>
                    <div className="text-sm text-muted-foreground">1st of each month</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$250.00</div>
                    <Button variant="ghost" size="sm" className="text-xs text-primary">Edit</Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <div className="font-medium">Roth IRA</div>
                    <div className="text-sm text-muted-foreground">15th of each month</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$200.00</div>
                    <Button variant="ghost" size="sm" className="text-xs text-primary">Edit</Button>
                  </div>
                </div>
                
                <Button variant="ghost" className="w-full flex justify-center items-center">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Contribution
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Retirement Insights</CardTitle>
              <CardDescription>Analysis of your retirement strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start pb-4 border-b">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Positive Growth Trajectory</div>
                    <div className="text-sm text-muted-foreground">Your retirement accounts are growing at 8.4% annually, outpacing the market average.</div>
                  </div>
                </div>
                
                <div className="flex items-start pb-4 border-b">
                  <Sigma className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Diversification Recommendation</div>
                    <div className="text-sm text-muted-foreground">Consider allocating 10% more to international equity funds for better diversification.</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Contribution Opportunity</div>
                    <div className="text-sm text-muted-foreground">You can still contribute $3,000 more to max out your IRA for the year.</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Retirement;
