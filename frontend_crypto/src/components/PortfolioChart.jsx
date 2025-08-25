import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import API from '../utils/api';
import { useCurrency } from '../context/CurrencyContext';
import _ from 'lodash';

export function PortfolioChart() {
  const [range, setRange] = useState('7D');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currency } = useCurrency();

  const currencySymbols = {
    usd: '$',
    inr: '₹',
    eur: '€',
  };

  const symbol = currencySymbols[currency?.toLowerCase()] || '$';

  // Debounced API call (not state update)
  const fetchChartData = useCallback(
    _.debounce(async (currentRange) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const res = await API.get(`/portfolio/portfolio-history?range=${currentRange}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const transformedData = res.data.map((item) => ({
          date: item.date || item.timestamp,
          value: item.value || item.amount,
        }));

        setChartData(transformedData);

        if (transformedData.length === 0) {
          setError('No data available for the selected range');
        }
      } catch (error) {
        console.error('Error fetching chart data:', error.response || error.message);
        setError(`Failed to load chart data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchChartData(range);
  }, [range, fetchChartData]);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg transition-all duration-300"
      style={{ minHeight: '500px', width: '100%' }}
    >
      {/* Header + Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3 sm:gap-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">📊 Portfolio Chart</h3>
        <div className="flex gap-3 sm:gap-4">
          {['7D', '30D', '1Y'].map((label) => (
            <button
              key={label}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all border ${
                range === label
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600'
              }`}
              onClick={() => setRange(label)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading chart...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 dark:text-red-400">{error}</div>
      ) : chartData.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No data available for the selected range
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            {/* Gradient Fill */}
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid + Axes */}
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} stroke="#cbd5e1" />
            <XAxis
              dataKey="date"
              stroke="#8884d8"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }
            />
            <YAxis
              stroke="#8884d8"
              domain={['auto', 'auto']}
              tickFormatter={(value) => `${symbol}${value.toLocaleString()}`}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
              }}
              labelStyle={{ color: '#ddd' }}
              formatter={(value) => `${symbol}${value.toLocaleString()}`}
              labelFormatter={(date) =>
                new Date(date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })
              }
            />

            {/* Line */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              dot={false}
              fill="url(#colorValue)"
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
