
import React from 'react';
import { Settings } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePreferences } from '@/contexts/PreferencesContext';
import { Separator } from '@/components/ui/separator';

const DashboardSettings: React.FC = () => {
  const {
    preferences,
    updateDashboardLayout,
    updateChartPreferences,
    resetPreferences,
  } = usePreferences();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="ml-auto">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Dashboard Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Dashboard Preferences</SheetTitle>
          <SheetDescription>
            Customize your dashboard to show the information that matters most to you.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Layout</CardTitle>
              <CardDescription>
                Choose which widgets to display on your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Market Indices</h4>
                  <p className="text-sm text-muted-foreground">
                    Display current market indices
                  </p>
                </div>
                <Switch
                  checked={preferences.dashboardLayout.showMarketIndices}
                  onCheckedChange={(checked) => updateDashboardLayout('showMarketIndices', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Portfolio Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Show portfolio performance chart
                  </p>
                </div>
                <Switch
                  checked={preferences.dashboardLayout.showPortfolioPerformance}
                  onCheckedChange={(checked) => updateDashboardLayout('showPortfolioPerformance', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Portfolio Holdings</h4>
                  <p className="text-sm text-muted-foreground">
                    Display your portfolio holdings
                  </p>
                </div>
                <Switch
                  checked={preferences.dashboardLayout.showPortfolio}
                  onCheckedChange={(checked) => updateDashboardLayout('showPortfolio', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Stock Overview</h4>
                  <p className="text-sm text-muted-foreground">
                    Show overview of your stocks
                  </p>
                </div>
                <Switch
                  checked={preferences.dashboardLayout.showStockOverview}
                  onCheckedChange={(checked) => updateDashboardLayout('showStockOverview', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Sector Allocation</h4>
                  <p className="text-sm text-muted-foreground">
                    Display sector allocation breakdown
                  </p>
                </div>
                <Switch
                  checked={preferences.dashboardLayout.showSectors}
                  onCheckedChange={(checked) => updateDashboardLayout('showSectors', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Recommendations</h4>
                  <p className="text-sm text-muted-foreground">
                    Show AI-powered recommendations
                  </p>
                </div>
                <Switch
                  checked={preferences.dashboardLayout.showRecommendations}
                  onCheckedChange={(checked) => updateDashboardLayout('showRecommendations', checked)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Chart Preferences</CardTitle>
              <CardDescription>
                Customize chart display settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Default Time Range</h4>
                <Select
                  value={preferences.chartPreferences.defaultTimeRange}
                  onValueChange={(value) => updateChartPreferences('defaultTimeRange', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select default time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Time Range</SelectLabel>
                      <SelectItem value="1D">1 Day</SelectItem>
                      <SelectItem value="1W">1 Week</SelectItem>
                      <SelectItem value="1M">1 Month</SelectItem>
                      <SelectItem value="3M">3 Months</SelectItem>
                      <SelectItem value="1Y">1 Year</SelectItem>
                      <SelectItem value="YTD">Year to Date</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Show Volume</h4>
                  <p className="text-sm text-muted-foreground">
                    Display volume bars on charts
                  </p>
                </div>
                <Switch
                  checked={preferences.chartPreferences.showVolume}
                  onCheckedChange={(checked) => updateChartPreferences('showVolume', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Chart Theme</h4>
                <Select
                  value={preferences.chartPreferences.theme}
                  onValueChange={(value) => updateChartPreferences('theme', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Theme</SelectLabel>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Separator />
          
          <div className="flex justify-end gap-4">
            <Button
              variant="destructive"
              onClick={resetPreferences}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DashboardSettings;
