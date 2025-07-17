// components/WalletOverview.jsx
import React, { useEffect, useState } from 'react';
import { fetchMarketData } from '../utils/cryptoAPI';

export function WalletOverview() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    fetchMarketData('usd', 5).then(setCoins);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-4">💼 My Wallet</h3>
      <ul className="space-y-3">
        {coins.map((coin) => (
          <li key={coin.id} className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
            <div className="flex items-center gap-2">
              <img src={coin.image} alt={coin.name} className="w-5 h-5" />
              <span>{coin.name}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              ${coin.current_price.toLocaleString()} • {coin.price_change_percentage_24h.toFixed(2)}%
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
