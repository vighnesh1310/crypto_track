// components/TrendingCoins.jsx
import React, { useEffect, useState } from 'react';
import { fetchMarketData } from '../utils/cryptoAPI';

export function TrendingCoins() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    fetchMarketData('usd', 10).then((data) => {
      setCoins(data.slice(0, 10)); // ensures exactly 10 coins max
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-4">🚀 Trending Coins</h3>
      <ul className="space-y-3">
        {coins.map((coin, index) => (
          <li key={coin.id} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="font-bold text-gray-400 dark:text-gray-500">#{index + 1}</span>
              <img src={coin.image} alt={coin.name} className="w-5 h-5" />
              <span>{coin.name}</span>
            </span>
            <span className={
              coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'
            }>
              {coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
