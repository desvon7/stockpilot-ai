
import React from 'react';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { usePreferences } from '@/contexts/PreferencesContext';

const DashboardLayoutSettings: React.FC = () => {
  const { preferences, updateDashboardLayout } = usePreferences();

  return (
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
  );
};

export default DashboardLayoutSettings;
