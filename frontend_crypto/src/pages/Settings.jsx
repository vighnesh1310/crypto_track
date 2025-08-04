import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import { useCurrency } from '../context/CurrencyContext';

export function Settings({ inModal = false }) {
  const { user, setUser } = useUser();
  const [settings, setSettings] = useState({
    darkMode: false,
    notificationEnabled: true,
    defaultCurrency: 'USD',
  });
  const [loading, setLoading] = useState(true);
  const { setCurrency } = useCurrency();

  useEffect(() => {
    if (user?.settings) {
      setSettings(user.settings);
      setLoading(false);
    } else {
      fetchSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await API.get('/user/profile');
      setUser(res.data);
      setSettings(res.data.settings || settings);
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = async () => {
  try {
    const res = await API.put('/user/settings', settings);
    setUser((prev) => ({ ...prev, settings: res.data.settings }));
    setCurrency(res.data.settings.defaultCurrency); // ✅ update context
    toast.success('Settings updated');
  } catch (err) {
    toast.error('Failed to update settings');
  }
};

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`space-y-6 ${
        inModal ? '' : 'p-6 max-w-xl mx-auto'
      } bg-white dark:bg-gray-900 shadow rounded text-gray-800 dark:text-gray-200 transition-all duration-300`}
    >
      <h2 className="text-2xl font-bold">⚙️ App Settings</h2>

      {/* Dark Mode Toggle */}
      <div className="flex justify-between items-center">
        <label className="font-medium">🌙 Dark Mode</label>
        <input
          type="checkbox"
          name="darkMode"
          checked={settings.darkMode}
          onChange={handleChange}
          className="w-5 h-5 accent-indigo-600"
        />
      </div>

      {/* Notification Toggle */}
      <div className="flex justify-between items-center">
        <label className="font-medium">🔔 Notifications</label>
        <input
          type="checkbox"
          name="notificationEnabled"
          checked={settings.notificationEnabled}
          onChange={handleChange}
          className="w-5 h-5 accent-indigo-600"
        />
      </div>

      {/* Currency Select */}
      <div className="flex justify-between items-center">
        <label className="font-medium">💰 Default Currency</label>
        <select
          name="defaultCurrency"
          value={settings.defaultCurrency}
          onChange={handleChange}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      <button
        onClick={handleUpdate}
        className="w-full mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        Save Settings
      </button>
    </div>
  );
}
