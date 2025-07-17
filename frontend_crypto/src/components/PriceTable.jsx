import React, { useEffect, useState } from 'react';
import { fetchMarketData } from '../utils/cryptoAPI';

export function PriceTable() {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMarketData('usd', 10).then(data => setCoins(data));
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Market Prices</h2>

      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search coin by name or symbol"
        className="w-full p-2 mb-4 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 📊 Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-200 dark:border-gray-700">
            <th>Name</th>
            <th>Price</th>
            <th>24h Change</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {filteredCoins.map((coin) => (
            <tr key={coin.id} className="border-b border-gray-100 dark:border-gray-700">
              <td className="py-2 flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                {coin.name} ({coin.symbol.toUpperCase()})
              </td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td className={coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </td>
              <td>${coin.market_cap.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
