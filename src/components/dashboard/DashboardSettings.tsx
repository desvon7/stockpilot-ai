
import React, { memo } from 'react';
import { Settings } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardLayoutSettings from './settings/DashboardLayoutSettings';
import ChartPreferencesSettings from './settings/ChartPreferencesSettings';

// Memoize the component for better performance
const DashboardSettings: React.FC = memo(() => {
  const { resetPreferences } = usePreferences();
  const isMobile = useIsMobile();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="ml-auto">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Dashboard Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        className={isMobile ? "w-full max-w-full" : "max-w-md"}
        side={isMobile ? "bottom" : "right"}
      >
        <SheetHeader>
          <SheetTitle>Dashboard Preferences</SheetTitle>
          <SheetDescription>
            Customize your dashboard to show the information that matters most to you.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          <DashboardLayoutSettings />
          <ChartPreferencesSettings />
          
          <Separator />
          
          <div className="flex justify-end gap-4">
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button
              variant="destructive"
              onClick={() => {
                resetPreferences();
              }}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});

DashboardSettings.displayName = 'DashboardSettings';
export default DashboardSettings;
