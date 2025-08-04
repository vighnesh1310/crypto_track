// utils/portfolioUtils.js
export function calculatePortfolioStats(holdings, marketData) {
  let total = 0, prevTotal = 0;

  holdings.forEach((h) => {
    const coin = marketData.find((c) => c.id === h.coinId);
    if (coin) {
      const qty = parseFloat(h.quantity);
      const current = coin.current_price;
      const prev = current / (1 + coin.price_change_percentage_24h / 100);
      total += qty * current;
      prevTotal += qty * prev;
    }
  });

  const gain24h = ((total - prevTotal) / prevTotal) * 100;
  return { total, gain24h: isFinite(gain24h) ? gain24h : 0 };
}
