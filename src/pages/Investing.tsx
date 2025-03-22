
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { usePortfolio } from '@/hooks/usePortfolio';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { ChevronRight, Info } from 'lucide-react';

const Investing: React.FC = () => {
  const { portfolio, isLoading } = usePortfolio();
  
  // Mock data for the portfolio breakdown
  const portfolioData = [
    { name: 'Stocks', value: 468.00, color: '#4ade80', percentage: 90.07 },
    { name: 'Cryptocurrencies', value: 46.87, color: '#f87171', percentage: 9.02 },
    { name: 'Cash', value: 4.75, color: '#60a5fa', percentage: 0.91 }
  ];

  const stockData = [
    { symbol: 'EXOD', name: 'Exodus Movement, Inc.', shares: 10, price: 46.80, cost: 35.00, totalReturn: 82.00, equity: 468.00 }
  ];

  const cryptoData = [
    { symbol: 'PEPE', name: 'Pepe', quantity: '6,473,553.00', price: 0.00000724, cost: 0.00, totalReturn: -56.13, equity: 46.87 }
  ];

  const totalPortfolioValue = portfolioData.reduce((acc, item) => acc + item.value, 0);

  return (
    <>
      <Helmet>
        <title>Investing | StockPilot</title>
      </Helmet>
      
      <AccountLayout title="">
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <nav className="flex space-x-4 text-sm font-medium">
              {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className={`${item === 'Investing' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          
          <h1 className="text-3xl font-bold">${formatCurrency(totalPortfolioValue)}</h1>
          
          <div className="flex items-center text-green-500">
            <span>▲ $12.46 (2.52%) Today</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Stocks</h2>
                  <span className="text-sm text-muted-foreground">{portfolioData[0].percentage}%</span>
                </div>
                
                <table className="w-full mb-4">
                  <thead className="text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Symbol</th>
                      <th className="pb-2">Shares</th>
                      <th className="pb-2">Price</th>
                      <th className="pb-2">Average cost</th>
                      <th className="pb-2">Total return</th>
                      <th className="pb-2 text-right">Equity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockData.map((stock) => (
                      <tr key={stock.symbol} className="border-b border-border">
                        <td className="py-3">{stock.name}</td>
                        <td className="py-3">{stock.symbol}</td>
                        <td className="py-3">{stock.shares}</td>
                        <td className="py-3">${stock.price.toFixed(2)}</td>
                        <td className="py-3">${stock.cost.toFixed(2)}</td>
                        <td className="py-3 text-green-500">▲ ${stock.totalReturn.toFixed(2)}</td>
                        <td className="py-3 text-right">${stock.equity.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Cryptocurrencies</h2>
                  <span className="text-sm text-muted-foreground">{portfolioData[1].percentage}%</span>
                </div>
                
                <table className="w-full mb-4">
                  <thead className="text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Symbol</th>
                      <th className="pb-2">Quantity</th>
                      <th className="pb-2">Price</th>
                      <th className="pb-2">Average cost</th>
                      <th className="pb-2">Total return</th>
                      <th className="pb-2 text-right">Equity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cryptoData.map((crypto) => (
                      <tr key={crypto.symbol} className="border-b border-border">
                        <td className="py-3">{crypto.name}</td>
                        <td className="py-3">{crypto.symbol}</td>
                        <td className="py-3">{crypto.quantity}</td>
                        <td className="py-3">${crypto.price.toFixed(8)}</td>
                        <td className="py-3">${crypto.cost.toFixed(2)}</td>
                        <td className="py-3 text-red-500">▼ ${crypto.totalReturn.toFixed(2)}</td>
                        <td className="py-3 text-right">${crypto.equity.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg mb-2">Margin investing</h3>
                  <div className="mb-2 font-bold">Disabled</div>
                  <p className="text-sm text-muted-foreground mb-4">Margin investing is a feature that allows you to borrow money for greater potential gains or losses. Margin investing is currently disabled for your account.</p>
                  <Button variant="outline" className="w-full">Enable Margin Investing</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg mb-2">Instant Deposits</h3>
                  <div className="mb-2 font-bold text-green-500">GOOD</div>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total pending deposits</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Instant Deposits</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Instant Deposits used</span>
                      <span>$0.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg mb-2">Withdrawable Cash</h3>
                  <div className="mb-2 font-bold">${portfolioData[2].value.toFixed(2)}</div>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Individual Cash</span>
                      <span>${portfolioData[2].value.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Withdrawable Cash</span>
                      <span>${portfolioData[2].value.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg mb-2">Dividend reinvestment</h3>
                  <div className="mb-2 font-bold">Disabled</div>
                  <p className="text-sm text-muted-foreground mb-4">Dividend reinvestment (DRIP) automatically reinvests cash dividend payments into additional shares of the underlying stock or fund.</p>
                  <p className="text-sm text-muted-foreground mb-4">You can turn it on in <span className="text-primary">Settings</span>.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg mb-2">Stock Lending</h3>
                  <div className="mb-2 font-bold">Disabled</div>
                  <p className="text-sm text-muted-foreground mb-4">With Stock Lending, get the opportunity to earn extra income on your portfolio. <span className="text-primary">Learn more</span></p>
                  <Button variant="outline" className="w-full">Activate Stock Lending</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg mb-2">Day trades</h3>
                  <div className="mb-2 font-bold">0 of 3</div>
                  <p className="text-sm text-muted-foreground mb-4">A day trade is when you open and close the same stock or option position on the same day.</p>
                  <Button variant="outline" className="w-full">Day trade settings</Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg mb-2">Cash sweep program</h3>
                  <div className="mb-2 font-bold">Disabled</div>
                  <p className="text-sm text-muted-foreground mb-4">You can earn up to 4% APY on the uninvested cash in your account by having it swept to program banks. <span className="text-primary">Learn more</span></p>
                  <Button variant="outline" className="w-full">Enable cash sweep</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg mb-2">Futures and event contracts trading</h3>
                  <div className="mb-2 font-bold">Enabled</div>
                  <p className="text-sm text-muted-foreground mb-4">Futures give you nearly 24-hour access to trade price movements of stock indexes, crypto, commodities and more with leverage.</p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full mb-2">View list of futures</Button>
                    <Button variant="outline" size="sm" className="w-full">Trade event contracts</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardContent className="p-4 flex flex-col items-center">
                <h3 className="text-lg font-medium mb-4 self-start">Total portfolio value</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={1}
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-xl font-bold mt-2">${formatCurrency(totalPortfolioValue)}</div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardContent className="p-4 flex flex-col items-center">
                <h3 className="text-lg font-medium mb-4 self-start">Stocks & options</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={[{ name: 'Stocks', value: portfolioData[0].value, color: '#4ade80' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={1}
                      dataKey="value"
                    >
                      <Cell fill="#4ade80" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-xl font-bold mt-2">${formatCurrency(portfolioData[0].value)}</div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardContent className="p-4 flex flex-col items-center">
                <h3 className="text-lg font-medium mb-4 self-start">Cryptocurrencies</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={[{ name: 'Crypto', value: portfolioData[1].value, color: '#f87171' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={1}
                      dataKey="value"
                    >
                      <Cell fill="#f87171" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-xl font-bold mt-2">${formatCurrency(portfolioData[1].value)}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AccountLayout>
    </>
  );
};

export default Investing;
