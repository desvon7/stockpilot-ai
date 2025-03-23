
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
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { usePreferences } from '@/contexts/PreferencesContext';
import DashboardLayoutSettings from './settings/DashboardLayoutSettings';
import ChartPreferencesSettings from './settings/ChartPreferencesSettings';

const DashboardSettings: React.FC = () => {
  const { resetPreferences } = usePreferences();

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
          <DashboardLayoutSettings />
          <ChartPreferencesSettings />
          
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
