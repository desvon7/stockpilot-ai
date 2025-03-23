
// Recommendation Data
export type Recommendation = {
  id: string;
  symbol: string;
  name: string;
  type: 'buy' | 'sell' | 'hold';
  confidence: number;
  reason: string;
  targetPrice: number;
  currentPrice: number;
};

export const recommendationData: Recommendation[] = [
  {
    id: '1',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    type: 'buy',
    confidence: 0.85,
    reason: 'Strong growth potential in electric vehicle market and energy sector.',
    targetPrice: 250.00,
    currentPrice: 215.32
  },
  {
    id: '2',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    type: 'buy',
    confidence: 0.78,
    reason: 'Continuous expansion in cloud services and e-commerce dominance.',
    targetPrice: 205.00,
    currentPrice: 185.45
  },
  {
    id: '3',
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    type: 'hold',
    confidence: 0.62,
    reason: 'Potential growth in metaverse technology balanced with regulatory concerns.',
    targetPrice: 520.00,
    currentPrice: 509.03
  },
  {
    id: '4',
    symbol: 'INTC',
    name: 'Intel Corporation',
    type: 'sell',
    confidence: 0.71,
    reason: 'Losing market share to competitors and slow product innovation cycle.',
    targetPrice: 32.00,
    currentPrice: 42.50
  }
];

// Export the mockRecommendations alias for the recommendationData
export const mockRecommendations = recommendationData;
