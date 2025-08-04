import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';

export const SummaryCards = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currency } = useCurrency();

  const loadCoinData = async () => {
    try {
      const { data } = await axiosInstance.get('/dashboard/summary', {
        params: { currency: currency.toLowerCase() }
      });
      setSummary(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoinData();
  }, [currency]); // refetch on currency change

  if (loading) return <div>Loading summary...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
      <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded-2xl">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Total Value</p>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          {formatCurrency(summary?.totalValue, currency)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded-2xl">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Total Investment</p>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          {formatCurrency(summary?.totalInvestment, currency)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded-2xl">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Total Profit</p>
        <p className="text-lg font-semibold text-green-600">
          {formatCurrency(summary?.totalProfit, currency)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded-2xl">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Profit %</p>
        <p className={`text-lg font-semibold ${summary?.totalProfitPercent >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {summary?.totalProfitPercent?.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};
