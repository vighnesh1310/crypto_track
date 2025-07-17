// components/QuickTrade.jsx
import React, { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';

export function QuickTrade() {
  const [symbol, setSymbol] = useState('BTC');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Trade placed: ${amount} USD for ${symbol}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ArrowRightLeft className="w-5 h-5 text-indigo-500" /> Quick Trade
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1">Select Coin</label>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded"
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="BNB">Binance Coin (BNB)</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="$100"
            className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Place Trade
        </button>
      </form>
    </div>
  );
}
