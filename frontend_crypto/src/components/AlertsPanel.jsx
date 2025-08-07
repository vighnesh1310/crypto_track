// components/AlertsPanel.jsx
import React, { useEffect, useState } from 'react';
import { BellRing, TriangleAlert } from 'lucide-react';
import { fetchMarketData } from '../utils/cryptoAPI';

const alertRules = [
  {
    symbol: 'BTC',
    condition: (price) => price > 65000,
    message: 'Bitcoin crossed $65,000',
    type: 'success',
  },
  {
    symbol: 'ETH',
    condition: (price) => price < 3000,
    message: 'ETH dropped below $3,000',
    type: 'warning',
  },
];

const getAlertColor = (type) => {
  switch (type) {
    case 'success':
      return 'text-green-500';
    case 'warning':
      return 'text-yellow-500';
    case 'error':
      return 'text-red-500';
    case 'info':
      return 'text-blue-500';
    default:
      return 'text-gray-400';
  }
};

export function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const checkAlerts = async () => {
      try {
        const marketData = await fetchMarketData('USD');

        const activeAlerts = alertRules
          .map((rule) => {
            const coin = marketData.find((c) => c.symbol === rule.symbol);
            if (!coin) return null;
            if (rule.condition(coin.current_price)) {
              return {
                message: rule.message,
                type: rule.type,
                time: new Date().toLocaleTimeString(),
              };
            }
            return null;
          })
          .filter(Boolean);

        setAlerts(activeAlerts);
      } catch (err) {
        console.error('❌ Error checking alerts:', err.message);
      }
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, 60 * 1000); // ⏱ check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BellRing className="w-5 h-5 text-yellow-500" /> Alerts
      </h3>

      {alerts.length === 0 ? (
        <p className="text-sm text-gray-400">No alerts triggered.</p>
      ) : (
        <ul className="space-y-4 text-sm">
          {alerts.map((alert, index) => (
            <li key={index} className="flex items-start gap-3">
              <TriangleAlert className={`w-4 h-4 mt-0.5 ${getAlertColor(alert.type)}`} />
              <div>
                <p>{alert.message}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{alert.time}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
