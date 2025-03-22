
// Enhanced fallback data with more diverse assets
export const FALLBACK_SEARCH_RESULTS = [
  // ETFs
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'IEFA', name: 'iShares Core MSCI EAFE ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  
  // Popular stocks
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'META', name: 'Meta Platforms Inc.', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'V', name: 'Visa Inc.', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  
  // Index funds
  { symbol: 'VFIAX', name: 'Vanguard 500 Index Fund', type: 'Mutual Fund', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'VTSAX', name: 'Vanguard Total Stock Market Index Fund', type: 'Mutual Fund', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  
  // Sector ETFs
  { symbol: 'XLF', name: 'Financial Select Sector SPDR Fund', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'XLK', name: 'Technology Select Sector SPDR Fund', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'XLE', name: 'Energy Select Sector SPDR Fund', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  
  // Crypto proxies
  { symbol: 'GBTC', name: 'Grayscale Bitcoin Trust', type: 'Trust', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'ETHE', name: 'Grayscale Ethereum Trust', type: 'Trust', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
];
