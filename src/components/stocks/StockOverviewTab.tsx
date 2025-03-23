
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatPercent, formatLargeCurrency } from '@/utils/formatters';

interface StockData {
  symbol: string;
  name: string;
  marketCap: number;
  peRatio: number;
  eps: number;
  dividendYield: number;
  beta: number;
  yearHigh: number;
  yearLow: number;
  volume: number;
  industry: string;
  sector: string;
  description?: string;
  ceo?: string;
  employees?: number;
  founded?: number;
  headquarters?: string;
}

interface StockOverviewTabProps {
  stockData: StockData;
}

const getCompanyDescription = (stock: StockData) => {
  if (stock.description) return stock.description;
  
  const descriptions: Record<string, string> = {
    'AAPL': `Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories. It also provides AppleCare support and cloud services. The company serves consumers, small and mid-sized businesses, education, enterprise, and government customers. It sells and delivers third-party applications for its products through the App Store. The company was founded in 1977 by Steve Jobs, Steve Wozniak, and Ronald Wayne, and is headquartered in Cupertino, California.`,
    'MSFT': `Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates through three segments: Productivity and Business Processes, Intelligent Cloud, and Personal Computing. The company offers Azure cloud services, Microsoft 365, Windows, and various other software solutions for businesses and consumers. Microsoft was founded in 1975 by Bill Gates and Paul Allen and is headquartered in Redmond, Washington.`,
    'GOOGL': `Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments. The Google Services segment provides products and services, such as ads, Android, Chrome, hardware, Google Maps, Google Play, Search, and YouTube. The Google Cloud segment offers infrastructure and data analytics platforms, collaboration tools, and other services for enterprise customers. The Other Bets segment sells internet and TV services, licenses research and development related intellectual property, and develops technology to enhance healthcare efficiency. The company was founded in 1998 and is headquartered in Mountain View, California.`,
    'TSLA': `Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems globally. The company operates through two segments, Automotive, and Energy Generation and Storage. The Automotive segment offers electric vehicles, including charging solutions. The Energy Generation and Storage segment provides solar energy generation and battery energy storage products. The company was founded in 2003 by Elon Musk, JB Straubel, Martin Eberhard, Marc Tarpenning, and Ian Wright, and is headquartered in Austin, Texas.`,
    'NVDA': `NVIDIA Corporation provides graphics, computing and networking solutions globally. The company operates through two segments, Graphics and Compute & Networking. The Graphics segment offers GeForce GPUs for gaming and PCs, the GeForce NOW game streaming service, and related infrastructure, as well as solutions for gaming platforms. The Compute & Networking segment provides data center platforms and systems for AI, HPC, and accelerated computing; Mellanox networking and interconnect solutions; automotive AI cockpit, autonomous driving development agreements, and autonomous vehicle solutions; and Jetson for robotics. The company was founded in 1993 and is headquartered in Santa Clara, California.`
  };
  
  return descriptions[stock.symbol] || 
    `${stock.name} is a leading company in the ${stock.industry} industry, part of the broader ${stock.sector} sector. The company is known for its innovative products and services, with a strong focus on research and development.`;
};

const StockOverviewTab: React.FC<StockOverviewTabProps> = ({ stockData }) => {
  const companyDescription = getCompanyDescription(stockData);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Overview</CardTitle>
        <CardDescription>Key metrics and information about {stockData.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="font-medium">{formatLargeCurrency(stockData.marketCap)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">P/E Ratio</p>
            <p className="font-medium">{stockData.peRatio.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">EPS</p>
            <p className="font-medium">{formatCurrency(stockData.eps)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dividend Yield</p>
            <p className="font-medium">{formatPercent(stockData.dividendYield / 100)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Beta</p>
            <p className="font-medium">{stockData.beta.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">52w High</p>
            <p className="font-medium">{formatCurrency(stockData.yearHigh)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">52w Low</p>
            <p className="font-medium">{formatCurrency(stockData.yearLow)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Volume</p>
            <p className="font-medium">{stockData.volume > 0 ? stockData.volume.toLocaleString() : 'N/A'}</p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div>
          <h3 className="font-medium mb-2">About {stockData.name}</h3>
          <p className="text-muted-foreground">
            {companyDescription}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockOverviewTab;
