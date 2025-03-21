
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StockChart from '@/components/ui/StockChart';
import { stockData, generateChartData } from '@/utils/mockData';
import { 
  formatCurrency, 
  formatPercent, 
  formatLargeCurrency, 
  formatNumber,
  getColorByChange, 
  getArrowByChange 
} from '@/utils/formatters';
import { ChevronLeft, Plus, Minus, Info, TrendingUp, BarChart4, DollarSign, Users } from 'lucide-react';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  
  const stock = stockData.find(s => s.symbol === symbol);
  
  if (!stock) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Stock Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find any stock with the symbol "{symbol}".
            </p>
            <button
              onClick={() => navigate(-1)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
            >
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const chartData = generateChartData(180, 0.02, stock.change > 0 ? 0.001 : -0.001);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={18} />
              <span>Back</span>
            </button>
          </div>
          
          <div className="glass-card rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                {stock.logo && (
                  <img 
                    src={stock.logo} 
                    alt={stock.name} 
                    className="w-12 h-12 object-contain bg-white p-1 rounded-md"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">{stock.symbol}</h1>
                    <span className="text-muted-foreground text-lg">•</span>
                    <span className="text-lg text-muted-foreground">{stock.name}</span>
                  </div>
                  <p className="text-muted-foreground">{stock.sector}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="text-3xl font-bold">{formatCurrency(stock.price)}</div>
                <div className={getColorByChange(stock.change)}>
                  {getArrowByChange(stock.change)} {formatCurrency(stock.change)} ({formatPercent(stock.changePercent)})
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <StockChart data={chartData} positiveChange={stock.change > 0} />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <DollarSign size={16} />
                  <span className="text-sm">Market Cap</span>
                </div>
                <div className="font-medium">{formatLargeCurrency(stock.marketCap)}</div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <BarChart4 size={16} />
                  <span className="text-sm">Volume</span>
                </div>
                <div className="font-medium">{formatNumber(stock.volume)}</div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp size={16} />
                  <span className="text-sm">P/E Ratio</span>
                </div>
                <div className="font-medium">{stock.pe.toFixed(2)}</div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users size={16} />
                  <span className="text-sm">Dividend</span>
                </div>
                <div className="font-medium">{stock.dividend}%</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">About {stock.name}</h2>
                <p className="text-muted-foreground mb-4">
                  {stock.name} is a leading company in the {stock.sector} sector, known for innovative products and strong market presence. The company has consistently shown growth and maintains a competitive edge in its industry.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">52-Week Range</span>
                    <span className="font-medium">{formatCurrency(stock.price * 0.8)} - {formatCurrency(stock.price * 1.2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Volume</span>
                    <span className="font-medium">{formatNumber(stock.volume * 0.9)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">EPS</span>
                    <span className="font-medium">{formatCurrency(stock.price / stock.pe)}</span>
                  </div>
                </div>
              </div>
              
              <div className="glass bg-muted/5 rounded-lg p-5">
                <h2 className="text-xl font-semibold mb-3">AI Analysis</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Sentiment</span>
                      <span className="text-sm font-medium text-success">Bullish</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-success rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Risk Level</span>
                      <span className="text-sm font-medium text-warning">Moderate</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-warning rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Volatility</span>
                      <span className="text-sm font-medium text-info">Low</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-info rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-border">
                    <p className="text-sm">
                      Our AI predicts a potential {stock.change > 0 ? 'uptrend' : 'downtrend'} for {stock.symbol} based on technical indicators, sentiment analysis, and market conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex-1 bg-success text-success-foreground hover:bg-success/90 rounded-lg px-4 py-3 font-medium flex items-center justify-center gap-2 transition-all">
                <Plus size={18} />
                Buy {stock.symbol}
              </button>
              <button className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg px-4 py-3 font-medium flex items-center justify-center gap-2 transition-all">
                <Minus size={18} />
                Sell {stock.symbol}
              </button>
            </div>
          </div>
          
          <div className="glass-card rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info size={18} className="text-primary" />
              <h2 className="text-xl font-semibold">Related Information</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Disclaimer: The information provided is for informational purposes only and does not constitute investment advice. All stock data is simulated for demonstration purposes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to={`/stocks/${stock.symbol}/news`}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Latest News
              </Link>
              <Link 
                to={`/stocks/${stock.symbol}/analysis`}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Detailed Analysis
              </Link>
              <Link 
                to={`/stocks/${stock.symbol}/financials`}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Financial Statements
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StockDetail;
