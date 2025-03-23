
import React from 'react';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
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

const ChartPreferencesSettings: React.FC = () => {
  const { preferences, updateChartPreferences } = usePreferences();

  return (
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
  );
};

export default ChartPreferencesSettings;
