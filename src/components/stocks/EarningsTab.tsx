
import React from 'react';
import { useEarnings } from '@/hooks/useFinancialData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, Calendar } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/utils/formatters';

interface EarningsTabProps {
  symbol: string;
}

const EarningsTab: React.FC<EarningsTabProps> = ({ symbol }) => {
  const { data: earnings, isLoading, error } = useEarnings(symbol);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (error || !earnings || earnings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
          <CardDescription>No earnings data available for {symbol}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="mx-auto h-12 w-12 opacity-20 mb-2" />
            <p>Earnings information could not be loaded</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
          <CardDescription>Quarterly earnings reports and analyst expectations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">EPS</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Estimated</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Surprise</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Revenue</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Est. Revenue</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((report, index) => {
                  const epsSurprise = report.eps - report.epsEstimated;
                  const epsSurprisePct = report.epsEstimated !== 0 ? epsSurprise / report.epsEstimated : 0;
                  const isEpsPositive = epsSurprise >= 0;
                  
                  const revSurprise = report.revenue - report.revenueEstimated;
                  const revSurprisePct = report.revenueEstimated !== 0 ? revSurprise / report.revenueEstimated : 0;
                  
                  return (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                          {new Date(report.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {report.eps !== undefined ? formatCurrency(report.eps) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {report.epsEstimated !== undefined ? formatCurrency(report.epsEstimated) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {epsSurprise !== undefined ? (
                          <div className={`flex items-center ${isEpsPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isEpsPositive ? (
                              <ArrowUpIcon className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownIcon className="h-3 w-3 mr-1" />
                            )}
                            {formatCurrency(Math.abs(epsSurprise))} ({formatPercent(Math.abs(epsSurprisePct))})
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {report.revenue !== undefined ? formatCurrency(report.revenue, 0) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {report.revenueEstimated !== undefined ? formatCurrency(report.revenueEstimated, 0) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsTab;
