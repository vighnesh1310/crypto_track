import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';
import { useCurrency } from '../context/CurrencyContext';
import { formatDistanceToNow } from 'date-fns';

export function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [rate, setRate] = useState(1);
  const { currency } = useCurrency();

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 🔹 Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      const res = await axiosInstance.get('/portfolio/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  // 🔹 Fetch conversion rate whenever currency changes
  useEffect(() => {
    if (currency) {
      fetchRate();
    }
  }, [currency]);

  const fetchRate = async () => {
    try {
      // CryptoCompare API
      const res = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${currency}`
      );
      setRate(res.data[currency]);
    } catch (err) {
      console.error('Failed to fetch conversion rate:', err);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Transaction History
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
          <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Coin</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Type</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Qty</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Price</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map(tx => (
              <tr key={tx._id}>
                <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{tx.symbol.toUpperCase()}</td>
                <td
                  className={`px-4 py-3 font-medium ${
                    tx.type === 'buy' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {tx.type.toUpperCase()}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{tx.quantity}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {currency} {(tx.price * rate).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                  {formatDistanceToNow(new Date(tx.date), { addSuffix: true })}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No transactions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
