
// Format fallback data to match Alpha Vantage format
export function formatToAlphaVantageFormat(items: any[]) {
  return items.map(item => ({
    '1. symbol': item.symbol,
    '2. name': item.name,
    '3. type': item.type,
    '4. region': item.region,
    '5. marketOpen': item.marketOpen,
    '6. marketClose': item.marketClose,
    '7. timezone': item.timezone,
    '8. currency': item.currency,
    '9. matchScore': item.matchScore
  }));
}
