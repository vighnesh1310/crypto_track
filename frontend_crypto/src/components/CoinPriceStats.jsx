// components/CoinPriceStats.jsx
import React from 'react';

export function CoinPriceStats({ coin }) {
  const data = coin?.market_data || {};
  const stats = [
    { label: 'Market Cap', value: data.market_cap?.usd },
    { label: '24h Volume', value: data.total_volume?.usd },
    { label: '24h High', value: data.high_24h?.usd },
    { label: '24h Low', value: data.low_24h?.usd }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          <p className="text-lg font-semibold">
            {stat.value !== undefined ? `$${stat.value.toLocaleString()}` : '—'}
          </p>
        </div>
      ))}
    </div>
  );
}
