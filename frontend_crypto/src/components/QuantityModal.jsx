// components/QuantityModal.jsx
import React, { useState } from 'react';

export function QuantityModal({ isOpen, onClose, onConfirm, coinName }) {
  const [quantity, setQuantity] = useState('');

  const handleConfirm = () => {
    const value = parseFloat(quantity);
    if (isNaN(value) || value <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }
    onConfirm(value);
    setQuantity('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Add {coinName} to Portfolio
        </h2>
        <input
          type="number"
          step="0.0001"
          placeholder="Enter quantity"
          className="w-full border px-4 py-2 rounded mb-4 dark:bg-gray-700 dark:text-white"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
