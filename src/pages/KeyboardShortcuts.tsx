
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';

const KeyboardShortcuts: React.FC = () => {
  // Define shortcuts
  const navigationShortcuts = [
    { keys: ['g', 'h'], action: 'Go to Home' },
    { keys: ['g', 'p'], action: 'Go to Portfolio' },
    { keys: ['g', 'w'], action: 'Go to Watchlists' },
    { keys: ['g', 'n'], action: 'Go to News' },
    { keys: ['g', 's'], action: 'Go to Settings' },
  ];

  const tradingShortcuts = [
    { keys: ['b'], action: 'Buy' },
    { keys: ['s'], action: 'Sell' },
    { keys: ['t'], action: 'Trade' },
    { keys: ['d'], action: 'Deposit' },
  ];

  const searchShortcuts = [
    { keys: ['/'], action: 'Search' },
    { keys: ['Esc'], action: 'Close search' },
    { keys: ['↑', '↓'], action: 'Navigate search results' },
    { keys: ['Enter'], action: 'Go to selected result' },
  ];

  const miscShortcuts = [
    { keys: ['?'], action: 'Show keyboard shortcuts' },
    { keys: ['Shift', 'c'], action: 'Customer support' },
    { keys: ['Shift', 'r'], action: 'Refresh page' },
    { keys: ['Shift', 'd'], action: 'Toggle dark mode' },
  ];

  // Helper to render shortcut keys
  const renderKey = (key: string) => (
    <span key={key} className="px-2 py-1 bg-muted rounded border border-border text-xs font-mono">{key}</span>
  );

  return (
    <>
      <Helmet>
        <title>Keyboard Shortcuts | StockPilot</title>
      </Helmet>
      
      <AccountLayout title="Keyboard Shortcuts">
        <p className="text-muted-foreground mb-8">Use these keyboard shortcuts to quickly navigate and perform actions in the app.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Navigation</h2>
              <div className="space-y-3">
                {navigationShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{shortcut.action}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <span className="text-muted-foreground mx-1">+</span>}
                          {renderKey(key)}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Trading</h2>
              <div className="space-y-3">
                {tradingShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{shortcut.action}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <span className="text-muted-foreground mx-1">+</span>}
                          {renderKey(key)}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Search</h2>
              <div className="space-y-3">
                {searchShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{shortcut.action}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <span className="text-muted-foreground mx-1">+</span>}
                          {renderKey(key)}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Miscellaneous</h2>
              <div className="space-y-3">
                {miscShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{shortcut.action}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <span className="text-muted-foreground mx-1">+</span>}
                          {renderKey(key)}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="p-4 border border-border rounded-md bg-muted/30">
          <p className="text-sm">To activate keyboard shortcuts, make sure you're not focused in an input field. Press <span className="px-2 py-1 bg-muted rounded border border-border text-xs font-mono">?</span> at any time to show this help screen.</p>
        </div>
      </AccountLayout>
    </>
  );
};

export default KeyboardShortcuts;
