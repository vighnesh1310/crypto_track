import React, { useEffect, useState } from 'react';
import { TrendingUp, AlertCircle, Bookmark, DollarSign } from 'lucide-react';
import API from '../utils/api';

export function SummaryCards() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    total: 0,
    gain24h: 0,
    watchlist: 0,
    alerts: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await API.get('/dashboard/summary');
        setData({
          total: res.data.total || 0,
          gain24h: res.data.gain24h || 0,
          watchlist: res.data.watchlist || 0,
          alerts: res.data.alerts || 0
        });
      } catch (err) {
        console.error('Error fetching summary:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const stats = [
    {
      title: 'Total Portfolio',
      value: `$${data.total.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5 text-green-500" />,
      bg: 'bg-green-50 dark:bg-green-900'
    },
    {
      title: '24h Gain',
      value: `${data.gain24h >= 0 ? '+' : ''}${data.gain24h.toFixed(2)}%`,
      icon: (
        <TrendingUp
          className={`w-5 h-5 ${data.gain24h >= 0 ? 'text-indigo-500' : 'text-red-500'}`}
        />
      ),
      bg: data.gain24h >= 0
        ? 'bg-indigo-50 dark:bg-indigo-900'
        : 'bg-red-50 dark:bg-red-900'
    },
    {
      title: 'Watchlist Coins',
      value: data.watchlist,
      icon: <Bookmark className="w-5 h-5 text-yellow-500" />,
      bg: 'bg-yellow-50 dark:bg-yellow-900'
    },
    {
      title: 'Alerts Triggered',
      value: data.alerts,
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      bg: 'bg-red-50 dark:bg-red-900'
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {loading
        ? Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
              >
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-6 bg-gray-400 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            ))
        : stats.map((item, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-4 rounded-xl shadow-sm hover:shadow-md transition ${item.bg}`}
            >
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {item.title}
                </p>
                <h3 className="text-xl font-semibold mt-1">{item.value}</h3>
              </div>
              <div className="ml-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow">
                {item.icon}
              </div>
            </div>
          ))}
    </section>
  );
}
