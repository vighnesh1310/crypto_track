// components/CoinMetaInfo.jsx
import React from 'react';

export function CoinMetaInfo({ coin }) {
  const data = coin?.market_data || {};
  const supply = coin?.market_data?.total_supply;
  const circSupply = coin?.market_data?.circulating_supply;
  const ath = data.ath?.usd;
  const athDate = data.ath_date?.usd;

  const stats = [
    { label: 'Total Supply', value: supply },
    { label: 'Circulating Supply', value: circSupply },
    { label: 'All-Time High', value: ath, extra: athDate && new Date(athDate).toLocaleDateString() }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          <p className="text-lg font-semibold">
            {stat.value !== undefined ? `$${stat.value.toLocaleString()}` : '—'}
          </p>
          {stat.extra && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">on {stat.extra}</p>
          )}
        </div>
      ))}
    </div>
  );
}
