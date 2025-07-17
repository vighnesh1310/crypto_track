import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const generateMockData = (days) => {
  return Array.from({ length: days }, (_, i) => ({
    date: `Day ${i + 1}`,
    value: Math.floor(1000 + Math.random() * 500)
  }));
};

export function PortfolioChart() {
  const [range, setRange] = useState('7D');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const days = range === '7D' ? 7 : range === '30D' ? 30 : 365;
    setChartData(generateMockData(days));
  }, [range]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">📊 Portfolio Chart</h3>
        <div className="flex gap-2">
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

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              color: '#fff',
              border: 'none',
              borderRadius: 6
            }}
            labelStyle={{ color: '#ddd' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
