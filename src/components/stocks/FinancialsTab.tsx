
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFinancialStatement, useKeyMetrics, useFinancialRatios } from '@/hooks/useFinancialData';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { DownloadIcon } from 'lucide-react';

interface FinancialsTabProps {
  symbol: string;
}

const FinancialsTab: React.FC<FinancialsTabProps> = ({ symbol }) => {
  const [period, setPeriod] = useState<'annual' | 'quarter'>('annual');
  const [statementType, setStatementType] = useState<'income' | 'balance' | 'cash-flow'>('income');
  
  const { data: statements, isLoading, error } = useFinancialStatement(symbol, statementType, period);
  const { data: metrics } = useKeyMetrics(symbol, period);
  const { data: ratios } = useFinancialRatios(symbol, period);
  
  const renderStatementTable = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      );
    }
    
    if (error || !statements || statements.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No financial data available for {symbol}</p>
        </div>
      );
    }
    
    const headers = ['Metric', ...statements.map(s => new Date(s.date).getFullYear().toString())];
    
    // Dynamically determine rows based on statement type
    let rows: { name: string; key: string }[] = [];
    
    switch (statementType) {
      case 'income':
        rows = [
          { name: 'Revenue', key: 'revenue' },
          { name: 'Cost of Revenue', key: 'costOfRevenue' },
          { name: 'Gross Profit', key: 'grossProfit' },
          { name: 'Operating Expenses', key: 'operatingExpenses' },
          { name: 'Operating Income', key: 'operatingIncome' },
          { name: 'Income Before Tax', key: 'incomeBeforeTax' },
          { name: 'Net Income', key: 'netIncome' },
          { name: 'EPS', key: 'eps' },
          { name: 'EBITDA', key: 'ebitda' },
        ];
        break;
      case 'balance':
        rows = [
          { name: 'Cash & Equivalents', key: 'cashAndCashEquivalents' },
          { name: 'Total Current Assets', key: 'totalCurrentAssets' },
          { name: 'Total Assets', key: 'totalAssets' },
          { name: 'Total Current Liabilities', key: 'totalCurrentLiabilities' },
          { name: 'Total Liabilities', key: 'totalLiabilities' },
          { name: 'Total Debt', key: 'totalDebt' },
          { name: 'Total Equity', key: 'totalEquity' },
        ];
        break;
      case 'cash-flow':
        rows = [
          { name: 'Operating Cash Flow', key: 'operatingCashFlow' },
          { name: 'Capital Expenditure', key: 'capitalExpenditure' },
          { name: 'Free Cash Flow', key: 'freeCashFlow' },
          { name: 'Dividends Paid', key: 'dividendsPaid' },
          { name: 'Net Cash from Financing', key: 'netCashUsedForFinancingActivities' },
          { name: 'Net Cash from Investing', key: 'netCashUsedForInvestingActivities' },
          { name: 'Net Change in Cash', key: 'netChangeInCash' },
        ];
        break;
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-3 text-left text-sm font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b hover:bg-muted/50">
                <td className="px-4 py-3 text-sm font-medium">{row.name}</td>
                {statements.map((statement, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-sm">
                    {statement[row.key] !== undefined ? formatCurrency(statement[row.key]) : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderMetricsSection = () => {
    if (!metrics || metrics.length === 0) return null;
    
    const latestMetrics = metrics[0];
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
          <CardDescription>Financial Performance Indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">PE Ratio</p>
              <p className="text-lg font-semibold">{latestMetrics.peRatio?.toFixed(2) || '-'}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">PB Ratio</p>
              <p className="text-lg font-semibold">{latestMetrics.pbRatio?.toFixed(2) || '-'}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">ROE</p>
              <p className="text-lg font-semibold">{latestMetrics.roe ? formatPercent(latestMetrics.roe) : '-'}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Dividend Yield</p>
              <p className="text-lg font-semibold">{latestMetrics.dividendYield ? formatPercent(latestMetrics.dividendYield) : '-'}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Debt to Equity</p>
              <p className="text-lg font-semibold">{latestMetrics.debtToEquity?.toFixed(2) || '-'}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Current Ratio</p>
              <p className="text-lg font-semibold">{latestMetrics.currentRatio?.toFixed(2) || '-'}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Interest Coverage</p>
              <p className="text-lg font-semibold">{latestMetrics.interestCoverage?.toFixed(2) || '-'}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">ROIC</p>
              <p className="text-lg font-semibold">{latestMetrics.roic ? formatPercent(latestMetrics.roic) : '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs defaultValue="income" className="w-full" onValueChange={(value) => setStatementType(value as any)}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
            <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={period === 'annual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('annual')}
            >
              Annual
            </Button>
            <Button
              variant={period === 'quarter' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('quarter')}
            >
              Quarterly
            </Button>
          </div>
          
          <Button variant="outline" size="sm">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{symbol} Financial Statements</CardTitle>
          <CardDescription>
            {statementType === 'income' && 'Income statement showing revenue, expenses, and profit'}
            {statementType === 'balance' && 'Balance sheet showing assets, liabilities, and equity'}
            {statementType === 'cash-flow' && 'Cash flow statement showing operating, investing, and financing activities'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStatementTable()}
        </CardContent>
      </Card>
      
      {renderMetricsSection()}
    </div>
  );
};

export default FinancialsTab;
