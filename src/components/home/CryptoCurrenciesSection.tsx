
import React from 'react';

interface CryptoCurrency {
  symbol: string;
  name: string;
  price: number;
  change: number;
  holdings: number;
}

interface CryptoCurrenciesSectionProps {
  cryptos: CryptoCurrency[];
}

const CryptoCurrenciesSection: React.FC<CryptoCurrenciesSectionProps> = ({ cryptos }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Cryptocurrencies</h2>
      <div className="space-y-3">
        {cryptos.map((crypto) => (
          <div key={crypto.symbol} className="flex justify-between items-center border-b border-border pb-3">
            <div>
              <div className="font-medium">{crypto.symbol}</div>
              <div className="text-sm text-muted-foreground">{crypto.holdings.toLocaleString()}</div>
            </div>
            <div className="flex">
              <div className="w-20 h-10">
                <svg viewBox="0 0 100 30" width="100%" height="100%">
                  <path d="M0,15 L10,20 L20,5 L30,25 L40,10 L50,15 L60,5 L70,20 L80,10 L90,15 L100,5" 
                        fill="none" 
                        stroke={crypto.change >= 0 ? "green" : "red"} 
                        strokeWidth="2" />
                </svg>
              </div>
              <div className="text-right ml-4">
                <div className="font-medium">${crypto.price.toFixed(8)}</div>
                <div className={crypto.change >= 0 ? "text-green-500" : "text-red-500"}>
                  {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoCurrenciesSection;
