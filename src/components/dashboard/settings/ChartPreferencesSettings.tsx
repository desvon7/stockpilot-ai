
import React, { memo } from 'react';
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
import { useIsMobile } from '@/hooks/use-mobile';

// Memoize the component for better performance
const ChartPreferencesSettings: React.FC = memo(() => {
  const { preferences, updateChartPreferences } = usePreferences();
  const isMobile = useIsMobile();

  const timeRangeOptions = [
    { value: '1D', label: '1 Day' },
    { value: '1W', label: '1 Week' },
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '1Y', label: '1 Year' },
    { value: 'YTD', label: 'Year to Date' },
  ];

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  return (
    <Card className={isMobile ? "border-none shadow-none p-0" : ""}>
      <CardHeader className={isMobile ? "px-0 pt-0" : ""}>
        <CardTitle>Chart Preferences</CardTitle>
        <CardDescription>
          Customize chart display settings
        </CardDescription>
      </CardHeader>
      <CardContent className={`space-y-4 ${isMobile ? "px-0" : ""}`}>
        <div className="space-y-2">
          <h4 className="font-medium">Default Time Range</h4>
          <Select
            value={preferences.chartPreferences.defaultTimeRange}
            onValueChange={(value) => updateChartPreferences(
              'defaultTimeRange', 
              value as any
            )}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select default time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time Range</SelectLabel>
                {timeRangeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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
            onValueChange={(value) => updateChartPreferences('theme', value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Theme</SelectLabel>
                {themeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
});

ChartPreferencesSettings.displayName = 'ChartPreferencesSettings';
export default ChartPreferencesSettings;
