// pages/Alerts.jsx
import React, { useState } from 'react';

export function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [coin, setCoin] = useState('');
  const [target, setTarget] = useState('');

  const addAlert = (e) => {
    e.preventDefault();
    if (!coin || !target) return;
    setAlerts([...alerts, { coin, target: parseFloat(target) }]);
    setCoin('');
    setTarget('');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔔 Price Alerts</h1>

      <form onSubmit={addAlert} className="space-y-3">
        <input
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
          placeholder="Coin ID (e.g. bitcoin)"
          className="border p-2 w-full"
        />
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target Price (USD)"
          type="number"
          className="border p-2 w-full"
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Set Alert</button>
      </form>

      <ul className="mt-6 space-y-2">
        {alerts.map((a, i) => (
          <li key={i} className="p-3 bg-white dark:bg-gray-800 rounded shadow">
            Alert for <strong>{a.coin}</strong> at <strong>${a.target}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
