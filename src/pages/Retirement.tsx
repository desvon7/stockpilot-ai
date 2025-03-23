
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Info, PlusCircle, Sigma, TrendingUp, Wallet, Clock, DollarSign, PieChart } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const Retirement: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <>
      <Helmet>
        <title>Retirement | StockPilot</title>
      </Helmet>
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Retirement Planning</h1>
            <p className="text-muted-foreground">Build your future with tax-advantaged investment accounts</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Account
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center text-xl">
                    <Wallet className="h-5 w-5 mr-2 text-primary" />
                    Traditional IRA
                  </CardTitle>
                  <CardDescription>Long-term retirement savings</CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-100/10 text-green-500 border-green-500/20">Tax-Deferred</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">$24,876.42</div>
              <div className="text-sm text-success flex items-center mb-4">
                <TrendingUp className="h-4 w-4 mr-1" />
                +$1,432.18 (5.8%) all time
              </div>
              <div className="flex space-x-2 mt-4">
                <Button className="flex-1">Manage</Button>
                <Button variant="outline" className="flex-1">Details</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center text-xl">
                    <Wallet className="h-5 w-5 mr-2 text-primary" />
                    Roth IRA
                  </CardTitle>
                  <CardDescription>Tax-free withdrawals in retirement</CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-100/10 text-blue-500 border-blue-500/20">Tax-Free Growth</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">$18,453.19</div>
              <div className="text-sm text-success flex items-center mb-4">
                <TrendingUp className="h-4 w-4 mr-1" />
                +$2,104.57 (11.4%) all time
              </div>
              <div className="flex space-x-2 mt-4">
                <Button className="flex-1">Manage</Button>
                <Button variant="outline" className="flex-1">Details</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl">
                <PieChart className="h-5 w-5 mr-2 text-primary" />
                Retirement Overview
              </CardTitle>
              <CardDescription>Summary of your retirement accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      2023 IRA Contribution
                    </span>
                    <span className="text-sm font-medium">$3,500 / $6,500</span>
                  </div>
                  <Progress value={53.8} max={100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">$3,000 remaining this year</p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      Retirement Goal
                    </span>
                    <span className="text-sm font-medium">$43,329 / $1.2M</span>
                  </div>
                  <Progress value={3.6} max={100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">3.6% of target retirement savings</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="ghost" className="w-full flex justify-between items-center text-primary">
                <span>Retirement Calculator</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Monthly Contributions
              </CardTitle>
              <CardDescription>Scheduled retirement account deposits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20 border border-border">
                  <div>
                    <div className="font-medium">Traditional IRA</div>
                    <div className="text-sm text-muted-foreground">1st of each month</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$250.00</div>
                    <Button variant="ghost" size="sm" className="text-xs text-primary">Edit</Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20 border border-border">
                  <div>
                    <div className="font-medium">Roth IRA</div>
                    <div className="text-sm text-muted-foreground">15th of each month</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$200.00</div>
                    <Button variant="ghost" size="sm" className="text-xs text-primary">Edit</Button>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full flex justify-center items-center mt-2">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Contribution
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl">
                <Sigma className="h-5 w-5 mr-2 text-primary" />
                Retirement Insights
              </CardTitle>
              <CardDescription>Analysis of your retirement strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-muted/20 border border-border">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Positive Growth Trajectory</div>
                      <div className="text-sm text-muted-foreground">Your retirement accounts are growing at 8.4% annually, outpacing the market average.</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-muted/20 border border-border">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                      <Sigma className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Diversification Recommendation</div>
                      <div className="text-sm text-muted-foreground">Consider allocating 10% more to international equity funds for better diversification.</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-muted/20 border border-border">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center mr-3">
                      <Info className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Contribution Opportunity</div>
                      <div className="text-sm text-muted-foreground">You can still contribute $3,000 more to max out your IRA for the year.</div>
                    </div>
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
