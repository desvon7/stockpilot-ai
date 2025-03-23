
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Building, TrendingUp, DollarSign, ArrowRight, PiggyBank, BarChart3 } from 'lucide-react';

const Retirement: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Retirement | StockPilot</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Retirement</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <Building className="mr-2 h-5 w-5 text-green-500" />
                    Traditional IRA
                  </CardTitle>
                  <Badge className="bg-gray-800 text-white">Not Started</Badge>
                </div>
                <CardDescription>Tax-deferred retirement account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Button className="bg-green-500 hover:bg-green-600">
                    Open Traditional IRA
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <Building className="mr-2 h-5 w-5 text-amber-500" />
                    Roth IRA
                  </CardTitle>
                  <Badge className="bg-gray-800 text-white">Not Started</Badge>
                </div>
                <CardDescription>Tax-free growth retirement account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Button className="bg-green-500 hover:bg-green-600">
                    Open Roth IRA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle>Retirement Calculator</CardTitle>
              <CardDescription>Plan your retirement journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Current Age</span>
                    <span className="font-medium">30</span>
                  </div>
                  <Progress value={30} max={100} className="h-2 bg-gray-800" indicatorClassName="bg-green-500" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Retirement Age</span>
                    <span className="font-medium">65</span>
                  </div>
                  <Progress value={65} max={100} className="h-2 bg-gray-800" indicatorClassName="bg-amber-500" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Current Savings</span>
                    <span className="font-medium">$0</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Monthly Contribution</span>
                    <span className="font-medium">$0</span>
                  </div>
                </div>
                
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  Calculate Retirement Needs
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <PiggyBank className="mr-2 h-5 w-5 text-green-500" />
                  Tax Advantages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">Save on taxes while preparing for retirement</p>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="text-green-500 p-0 h-auto flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                  Investment Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">Explore retirement-focused investment strategies</p>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="text-green-500 p-0 h-auto flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-green-500" />
                  Contribution Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">Understand annual contribution limits for IRAs</p>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="text-green-500 p-0 h-auto flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Retirement;
