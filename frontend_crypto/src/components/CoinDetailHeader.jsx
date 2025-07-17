// components/CoinDetailHeader.jsx
import React from 'react';

export function CoinDetailHeader({ coin }) {
  const price = coin?.market_data?.current_price?.usd;
  const change = coin?.market_data?.price_change_percentage_24h;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <img
          src={coin?.image?.large}
          alt={coin?.name}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">
            {coin?.name}{' '}
            <span className="uppercase text-gray-400 text-sm">({coin?.symbol})</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Rank #{coin?.market_cap_rank || 'N/A'}
          </p>
        </div>
      </div>

      <div className="text-center sm:text-right">
        <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
          ${price ? price.toLocaleString() : '—'}
        </p>
        {change !== undefined && (
          <p
            className={`text-sm ${
              change >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {change.toFixed(2)}% (24h)
          </p>
        )}
      </div>
    </div>
  );
}
