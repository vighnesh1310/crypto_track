import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { useSidebar } from '../context/SidebarContext';

const SOUND_URL = '/alert.wav'; // Ensure this file exists in the public folder

export function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [coin, setCoin] = useState('');
  const [target, setTarget] = useState('');
  const { isOpen } = useSidebar();

  // Ask for notification permission on load
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await axiosInstance.get('/alerts');
      setAlerts(res.data);
    } catch (err) {
      toast.error('Failed to load alerts');
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Poll CryptoCompare prices
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!alerts.length) return;

      const symbols = alerts.map((a) => a.coin.toUpperCase()).join(',');

      try {
        const res = await axios.get(
          `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols}&tsyms=USD`
        );

        alerts.forEach((alert) => {
          const coinSymbol = alert.coin.toUpperCase();
          const current = res.data[coinSymbol]?.USD;
          if (!current) return;

          const triggered = current >= alert.target;
          if (triggered) {
            playSound();
            showNotification(coinSymbol, current, alert.target);
            toast.success(`${coinSymbol} hit $${current}`);
            // Optionally mark alert as triggered or delete
          }
        });
      } catch (err) {
        console.warn('CryptoCompare price fetch failed:', err.message);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [alerts]);

  const playSound = () => {
    const audio = new Audio(SOUND_URL);
    audio.play();
  };

  const showNotification = (coin, current, target) => {
    if (Notification.permission === 'granted') {
      new Notification('💰 Price Alert Triggered', {
        body: `${coin} hit $${current} (Target: $${target})`,
        icon: '/favicon.ico',
      });
    }
  };

  const addAlert = async (e) => {
    e.preventDefault();
    const trimmedCoin = coin.trim().toUpperCase();
    const targetPrice = parseFloat(target);

    if (!trimmedCoin || isNaN(targetPrice) || targetPrice <= 0) {
      toast.error('Please enter a valid coin and target price.');
      return;
    }

    try {
      const res = await axiosInstance.post('/alerts', {
        coin: trimmedCoin,
        target: targetPrice,
      });
      setAlerts([...alerts, res.data]);
      setCoin('');
      setTarget('');
      toast.success(`Alert set for ${trimmedCoin} at $${targetPrice}`);
    } catch (err) {
      toast.error('Failed to set alert');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'} flex flex-col`}>
        <Topbar />
        <main className="p-6 max-w-3xl mx-auto w-full">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            🔔 Price Alerts
          </h1>

          <form onSubmit={addAlert} className="space-y-3">
            <input
              value={coin}
              onChange={(e) => setCoin(e.target.value)}
              placeholder="Coin Symbol (e.g. BTC)"
              className="border p-2 w-full rounded bg-white dark:bg-gray-800 dark:text-white"
            />
            <input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Target Price (USD)"
              type="number"
              min="0"
              className="border p-2 w-full rounded bg-white dark:bg-gray-800 dark:text-white"
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded w-full">
              Set Alert
            </button>
          </form>

          <ul className="mt-6 space-y-2">
            {alerts.map((a, i) => (
              <li key={i} className="p-3 bg-white dark:bg-gray-800 rounded shadow">
                Alert for <strong>{a.coin}</strong> at <strong>${a.target}</strong>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}
