
import { DollarSign } from "lucide-react";

// Mock data for portfolio
export const mockPortfolioData = {
  portfolioValue: 24783.65,
  dailyChange: 356.42,
  dailyChangePercent: 1.46,
  totalGain: 1583.65,
  totalGainPercent: 6.82,
  buyingPower: 5241.33,
};

// Mock data for recent activities
export const mockActivities = [
  {
    id: '1',
    type: 'buy' as const,
    symbol: 'AAPL',
    amount: 1250.45,
    shares: 5,
    price: 250.09,
    date: '2023-06-15T10:30:00Z',
    status: 'completed'
  },
  {
    id: '2',
    type: 'sell' as const,
    symbol: 'MSFT',
    amount: 840.32,
    shares: 2,
    price: 420.16,
    date: '2023-06-14T14:45:00Z',
    status: 'completed'
  },
  {
    id: '3',
    type: 'deposit' as const,
    amount: 2000.00,
    date: '2023-06-12T09:15:00Z',
    status: 'completed'
  },
  {
    id: '4',
    type: 'dividend' as const,
    symbol: 'VTI',
    amount: 32.17,
    date: '2023-06-10T08:00:00Z',
    status: 'completed'
  },
  {
    id: '5',
    type: 'buy' as const,
    symbol: 'GOOGL',
    amount: 1548.36,
    shares: 10,
    price: 154.84,
    date: '2023-06-08T11:20:00Z',
    status: 'completed'
  }
];

// Mock data for market indices
export const mockMarketIndices = [
  {
    name: 'S&P 500',
    value: 4592.73,
    change: 23.16,
    changePercent: 0.51
  },
  {
    name: 'Dow Jones',
    value: 36941.81,
    change: 128.32,
    changePercent: 0.35
  },
  {
    name: 'Nasdaq',
    value: 16394.16,
    change: -42.38,
    changePercent: -0.26
  },
  {
    name: 'Russell 2000',
    value: 2157.84,
    change: 15.73,
    changePercent: 0.73
  }
];

// Format current date for market overview
export const getFormattedDateTime = () => {
  const now = new Date();
  return now.toLocaleString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
