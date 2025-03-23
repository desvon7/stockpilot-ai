
import React, { memo } from 'react';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useIsMobile } from '@/hooks/use-mobile';

// Memoize the component for better performance
const DashboardLayoutSettings: React.FC = memo(() => {
  const { preferences, updateDashboardLayout } = usePreferences();
  const isMobile = useIsMobile();

  const settingsItems = [
    {
      key: 'showMarketIndices',
      title: 'Market Indices',
      description: 'Display current market indices',
    },
    {
      key: 'showPortfolioPerformance',
      title: 'Portfolio Performance',
      description: 'Show portfolio performance chart',
    },
    {
      key: 'showPortfolio',
      title: 'Portfolio Holdings',
      description: 'Display your portfolio holdings',
    },
    {
      key: 'showStockOverview',
      title: 'Stock Overview',
      description: 'Show overview of your stocks',
    },
    {
      key: 'showSectors',
      title: 'Sector Allocation',
      description: 'Display sector allocation breakdown',
    },
    {
      key: 'showRecommendations',
      title: 'Recommendations',
      description: 'Show AI-powered recommendations',
    }
  ];

  return (
    <Card className={isMobile ? "border-none shadow-none p-0" : ""}>
      <CardHeader className={isMobile ? "px-0 pt-0" : ""}>
        <CardTitle>Dashboard Layout</CardTitle>
        <CardDescription>
          Choose which widgets to display on your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className={`space-y-4 ${isMobile ? "px-0" : ""}`}>
        {settingsItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
            <Switch
              checked={preferences.dashboardLayout[item.key as keyof typeof preferences.dashboardLayout]}
              onCheckedChange={(checked) => updateDashboardLayout(
                item.key as keyof typeof preferences.dashboardLayout, 
                checked
              )}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
});

DashboardLayoutSettings.displayName = 'DashboardLayoutSettings';
export default DashboardLayoutSettings;
