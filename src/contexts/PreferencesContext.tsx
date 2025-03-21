
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define the types of preferences we'll support
export interface UserPreferences {
  // Dashboard layout preferences
  dashboardLayout: {
    showMarketIndices: boolean;
    showPortfolioPerformance: boolean;
    showPortfolio: boolean;
    showStockOverview: boolean;
    showSectors: boolean;
    showRecommendations: boolean;
  };
  // Chart preferences
  chartPreferences: {
    defaultTimeRange: '1D' | '1W' | '1M' | '3M' | '1Y' | 'YTD';
    showVolume: boolean;
    theme: 'light' | 'dark' | 'system';
  };
}

// Default preferences
const defaultPreferences: UserPreferences = {
  dashboardLayout: {
    showMarketIndices: true,
    showPortfolioPerformance: true,
    showPortfolio: true,
    showStockOverview: true,
    showSectors: true,
    showRecommendations: true,
  },
  chartPreferences: {
    defaultTimeRange: '1M',
    showVolume: true,
    theme: 'system',
  },
};

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  updateDashboardLayout: (key: keyof UserPreferences['dashboardLayout'], value: boolean) => void;
  updateChartPreferences: (key: keyof UserPreferences['chartPreferences'], value: any) => void;
  resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  // Load preferences from localStorage on initial render
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Failed to parse saved preferences', error);
        // If parsing fails, reset to defaults
        setPreferences(defaultPreferences);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  // Update the entire preferences object
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences,
    }));
    toast.success('Preferences updated');
  };

  // Update a specific dashboard layout setting
  const updateDashboardLayout = (key: keyof UserPreferences['dashboardLayout'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      dashboardLayout: {
        ...prev.dashboardLayout,
        [key]: value,
      },
    }));
  };

  // Update a specific chart preference
  const updateChartPreferences = (key: keyof UserPreferences['chartPreferences'], value: any) => {
    setPreferences(prev => ({
      ...prev,
      chartPreferences: {
        ...prev.chartPreferences,
        [key]: value,
      },
    }));
  };

  // Reset preferences to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    toast.success('Preferences reset to defaults');
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        updateDashboardLayout,
        updateChartPreferences,
        resetPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

// Hook to use the preferences context
export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
