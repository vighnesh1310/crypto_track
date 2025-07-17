// components/AlertsPanel.jsx
import React from 'react';
import { BellRing, TriangleAlert } from 'lucide-react';

const alerts = [
  {
    message: 'Bitcoin crossed $65,000',
    type: 'success',
    time: '2h ago'
  },
  {
    message: 'ETH dropped below $3,000',
    type: 'warning',
    time: '4h ago'
  }
];

export function AlertsPanel() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BellRing className="w-5 h-5 text-yellow-500" /> Alerts
      </h3>
      <ul className="space-y-4 text-sm">
        {alerts.map((alert, index) => (
          <li key={index} className="flex items-start gap-3">
            <TriangleAlert
              className={`w-4 h-4 mt-0.5 ${
                alert.type === 'success' ? 'text-green-500' : 'text-red-500'
              }`}
            />
            <div>
              <p>{alert.message}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">{alert.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
