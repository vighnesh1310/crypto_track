// components/CoinBalanceSummary.jsx
import React from 'react';

export function CoinBalanceSummary() {
  const balances = [
    { symbol: 'BTC', amount: 0.52, usd: 16000 },
    { symbol: 'ETH', amount: 3.1, usd: 8700 },
    { symbol: 'USDT', amount: 1500, usd: 1500 }
  ];

  const total = balances.reduce((sum, coin) => sum + coin.usd, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Your Portfolio Summary</h3>
      <div className="flex flex-wrap gap-4">
        {balances.map((coin, idx) => (
          <div
            key={idx}
            className="flex-1 min-w-[150px] bg-gray-100 dark:bg-gray-700 rounded-lg p-4"
          >
            <h4 className="text-lg font-medium">{coin.symbol}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {coin.amount} {coin.symbol}
            </p>
            <p className="font-bold text-indigo-600 dark:text-indigo-400">
              ${coin.usd.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right text-lg font-semibold">
        Total Value: <span className="text-indigo-600 dark:text-indigo-400">${total.toLocaleString()}</span>
      </div>
    </div>
  );
}
