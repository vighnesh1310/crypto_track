import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';

// ✅ Import icons from lucide-react
import { Wallet, Coins, TrendingUp, TrendingDown, Percent } from 'lucide-react';

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
      <SummaryCard 
        icon={<Wallet size={22} />} 
        title="Total Value" 
        value={summary?.totalValue} 
        currency={currency} 
        iconBg="bg-blue-100 dark:bg-blue-900 text-blue-500" 
      />
      <SummaryCard 
        icon={<Coins size={22} />} 
        title="Total Investment" 
        value={summary?.totalInvestment} 
        currency={currency} 
        iconBg="bg-purple-100 dark:bg-purple-900 text-purple-500" 
      />
      <SummaryCard 
        icon={<TrendingUp size={22} />} 
        title="Unrealized Profit" 
        value={summary?.unrealizedProfit} 
        currency={currency} 
        isProfit 
        dynamicBg 
      />
      <SummaryCard 
        icon={<TrendingDown size={22} />} 
        title="Realized Profit" 
        value={summary?.realizedProfit} 
        currency={currency} 
        isProfit 
        dynamicBg 
      />
      <SummaryCard 
        icon={<TrendingUp size={22} />} 
        title="Total Profit" 
        value={summary?.totalProfit} 
        currency={currency} 
        isProfit 
        dynamicBg 
      />
      <SummaryCard
        icon={<Percent size={22} />}
        title="Profit %"
        value={`${summary?.totalProfitPercent?.toFixed(2)}%`}
        isPercent
        highlight={summary?.totalProfitPercent >= 0}
        dynamicBg
      />
    </div>
  );
};

const SummaryCard = ({ title, value, currency, icon, isProfit = false, isPercent = false, highlight = null, iconBg, dynamicBg = false }) => {
  const displayValue = isPercent ? value : formatCurrency(value ?? 0, currency);

  const isPositive = (value ?? 0) >= 0;
  const color =
    highlight === null
      ? isProfit
        ? isPositive ? 'text-green-600' : 'text-red-500'
        : 'text-gray-800 dark:text-white'
      : highlight
        ? 'text-green-600'
        : 'text-red-500';

  // ✅ Dynamic background if required
  const dynamicBackground = dynamicBg
    ? isPositive
      ? 'bg-green-100 dark:bg-green-900 text-green-500'
      : 'bg-red-100 dark:bg-red-900 text-red-500'
    : iconBg;

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded-2xl flex items-center gap-3">
      {icon && (
        <div className={`p-2 rounded-full ${dynamicBackground}`}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
        <p className={`text-lg font-semibold ${color}`}>
          {displayValue}
        </p>
      </div>
    </div>
  );
};
