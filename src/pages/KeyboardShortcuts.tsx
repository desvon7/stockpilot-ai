
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const KeyboardShortcuts: React.FC = () => {
  // Define keyboard shortcuts
  const navigationShortcuts = [
    { key: 'g + h', description: 'Go to Home' },
    { key: 'g + s', description: 'Go to Stocks' },
    { key: 'g + c', description: 'Go to Crypto' },
    { key: 'g + w', description: 'Go to Watchlists' },
    { key: 'g + n', description: 'Go to News' },
    { key: 'g + p', description: 'Go to Profile' }
  ];

  const stockDetailShortcuts = [
    { key: 'b', description: 'Open Buy Dialog' },
    { key: 's', description: 'Open Sell Dialog' },
    { key: 't', description: 'Toggle Time Period (1D, 1W, 1M, etc.)' },
    { key: 'a', description: 'Add to Watchlist' },
    { key: 'e', description: 'Show Earnings' },
    { key: 'c', description: 'Show Company Info' }
  ];

  const generalShortcuts = [
    { key: '/', description: 'Focus Search' },
    { key: 'Esc', description: 'Close Modal / Dialog' },
    { key: 'Shift + ?', description: 'Show Keyboard Shortcuts' },
    { key: 'Ctrl + d', description: 'Toggle Dark Mode' },
    { key: 'r', description: 'Refresh Data' }
  ];

  return (
    <>
      <Helmet>
        <title>Keyboard Shortcuts | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <nav className="flex space-x-4 text-sm font-medium">
              {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className={`${item === 'Keyboard Shortcuts' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Keyboard Shortcuts</h1>
          <p className="text-muted-foreground mb-6">Use these keyboard shortcuts to navigate and interact with StockPilot more efficiently.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <tbody>
                  {navigationShortcuts.map((shortcut, index) => (
                    <tr key={index} className={index < navigationShortcuts.length - 1 ? "border-b border-border" : ""}>
                      <td className="py-3">
                        <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">{shortcut.key}</kbd>
                      </td>
                      <td className="py-3 pl-6">{shortcut.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Stock Detail View</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <tbody>
                  {stockDetailShortcuts.map((shortcut, index) => (
                    <tr key={index} className={index < stockDetailShortcuts.length - 1 ? "border-b border-border" : ""}>
                      <td className="py-3">
                        <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">{shortcut.key}</kbd>
                      </td>
                      <td className="py-3 pl-6">{shortcut.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>General</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <tbody>
                  {generalShortcuts.map((shortcut, index) => (
                    <tr key={index} className={index < generalShortcuts.length - 1 ? "border-b border-border" : ""}>
                      <td className="py-3">
                        <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">{shortcut.key}</kbd>
                      </td>
                      <td className="py-3 pl-6">{shortcut.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-muted-foreground text-sm">
            <strong>Pro tip:</strong> You can press <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">Shift + ?</kbd> at any time to display this shortcuts page.
          </p>
        </div>
      </AccountLayout>
    </>
  );
};

export default KeyboardShortcuts;
