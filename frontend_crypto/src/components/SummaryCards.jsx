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
  }, [currency]);

  if (loading) return <div className="px-4">Loading summary...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
      <SummaryCard title="Total Value" value={summary?.totalValue} currency={currency} />
      <SummaryCard title="Total Investment" value={summary?.totalInvestment} currency={currency} />
      <SummaryCard title="Unrealized Profit" value={summary?.unrealizedProfit} currency={currency} isProfit />
      <SummaryCard title="Realized Profit" value={summary?.realizedProfit} currency={currency} isProfit />
      <SummaryCard title="Total Profit" value={summary?.totalProfit} currency={currency} isProfit />
      <SummaryCard
        title="Profit %"
        value={`${summary?.totalProfitPercent?.toFixed(2)}%`}
        isPercent
        highlight={summary?.totalProfitPercent >= 0}
      />
    </div>
  );
};

const SummaryCard = ({ title, value, currency, isProfit = false, isPercent = false, highlight = null }) => {
  const displayValue = isPercent ? value : formatCurrency(value ?? 0, currency);
  const color =
    highlight === null
      ? isProfit
        ? value >= 0 ? 'text-green-600' : 'text-red-500'
        : 'text-gray-800 dark:text-white'
      : highlight
        ? 'text-green-600'
        : 'text-red-500';

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded-2xl">
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
      <p className={`text-lg font-semibold ${color}`}>
        {displayValue}
      </p>
    </div>
  );
};
