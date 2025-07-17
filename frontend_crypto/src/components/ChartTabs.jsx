// components/ChartTabs.jsx
import React, { useState } from 'react';

export function ChartTabs() {
  const [activeTab, setActiveTab] = useState('ALL');

  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-xl font-semibold">Portfolio Chart</h3>
      <div className="flex gap-2">
        {['BTC', 'ETH', 'ALL'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 rounded-full border transition ${
              activeTab === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}