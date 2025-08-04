import React from 'react';
import { Settings } from '../pages/Settings';

export function SettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg shadow-xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500 text-xl"
        >
          &times;
        </button>
        <Settings inModal />
      </div>
    </div>
  );
}
