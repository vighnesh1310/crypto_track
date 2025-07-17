// components/CoinChart.jsx
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// 💡 Replace with real API data if needed
const generateMockData = (days) => {
  return Array.from({ length: days }, (_, i) => ({
    date: `Day ${i + 1}`,
    value: Math.floor(1000 + Math.random() * 1000)
  }));
};

export function CoinChart({ coinId }) {
  const [range, setRange] = useState('7D');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const days = range === '7D' ? 7 : range === '30D' ? 30 : 365;
    setChartData(generateMockData(days));
  }, [range]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">📈 Price Chart</h3>
        <div className="space-x-2">
          {['7D', '30D', '1Y'].map((label) => (
            <button
              key={label}
              onClick={() => setRange(label)}
              className={`px-2 py-1 rounded text-sm font-medium transition ${
                range === label
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
