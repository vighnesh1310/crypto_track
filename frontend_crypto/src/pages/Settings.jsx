
import React from 'react';

export function Settings() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-6">⚙️ Settings</h1>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 max-w-xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <span>Enable Dark Mode</span>
          <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600" />
        </div>
        <div className="flex items-center justify-between">
          <span>Receive Email Notifications</span>
          <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Save Settings</button>
        </div>
      </div>
    </div>
  );
}
