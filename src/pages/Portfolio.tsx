
import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import usePortfolioData from "@/hooks/usePortfolioData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PortfolioAnalysisCard from "@/components/home/PortfolioAnalysisCard";
import { formatCurrency } from "@/utils/formatters";
import { Separator } from "@/components/ui/separator";

const Portfolio: React.FC = () => {
  const { portfolio, isLoading, error } = usePortfolioData();

  return (
    <>
      <Helmet>
        <title>Portfolio | StockPilot</title>
      </Helmet>
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Your Portfolio</h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <Card className="mb-6">
              <CardContent className="py-6">
                <p className="text-red-500">Error loading portfolio data. Please try again later.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="col-span-full md:col-span-1">
                <CardHeader>
                  <CardTitle>Portfolio Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="text-2xl font-bold">{formatCurrency(portfolio?.totalValue || 0)}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Available Cash</p>
                      <p className="text-lg font-semibold">{formatCurrency(portfolio?.availableCash || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Invested Value</p>
                      <p className="text-lg font-semibold">{formatCurrency((portfolio?.totalValue || 0) - (portfolio?.availableCash || 0))}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <PortfolioAnalysisCard className="col-span-full md:col-span-2" totalValue={(portfolio?.totalValue || 0) - (portfolio?.availableCash || 0)} />
              
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolio?.holdings && portfolio.holdings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Symbol</th>
                            <th className="text-left py-2">Name</th>
                            <th className="text-right py-2">Shares</th>
                            <th className="text-right py-2">Avg. Price</th>
                            <th className="text-right py-2">Current Price</th>
                            <th className="text-right py-2">Value</th>
                            <th className="text-right py-2">Return</th>
                          </tr>
                        </thead>
                        <tbody>
                          {portfolio.holdings.map((holding) => (
                            <tr key={holding.symbol} className="border-b hover:bg-muted/50">
                              <td className="py-3 font-medium">{holding.symbol}</td>
                              <td className="py-3">{holding.name}</td>
                              <td className="py-3 text-right">{holding.shares.toFixed(2)}</td>
                              <td className="py-3 text-right">{formatCurrency(holding.averagePrice)}</td>
                              <td className="py-3 text-right">{formatCurrency(holding.currentPrice)}</td>
                              <td className="py-3 text-right">{formatCurrency(holding.currentPrice * holding.shares)}</td>
                              <td className={`py-3 text-right ${
                                holding.returnPercentage >= 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {(holding.returnPercentage >= 0 ? '+' : '') + holding.returnPercentage.toFixed(2)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No holdings found in your portfolio.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default Portfolio;
