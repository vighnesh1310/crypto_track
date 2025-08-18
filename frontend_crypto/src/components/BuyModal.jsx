import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export function BuyModal({ isOpen, onClose, coin, onBuy }) {
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (!isOpen) setQuantity('');
  }, [isOpen]);

  const handleBuy = () => {
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      toast.error('Enter a valid quantity.');
      return;
    }
    onBuy(coin.id, qty); // ✅ Let the parent handle the actual logic
    onClose();
  };

  if (!isOpen || !coin) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-sm shadow-lg">
        <h2 className="text-lg font-bold mb-4">Buy {coin.name}</h2>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
          min="0"
          className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleBuy}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}