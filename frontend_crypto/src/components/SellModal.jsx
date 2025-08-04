import React, { useState, useEffect } from 'react';

export function SellModal({ isOpen, onClose, coin, onSell }) {
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (!isOpen) setQuantity('');
  }, [isOpen]);

  const handleSell = async () => {
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      alert('Enter a valid quantity.');
      return;
    }

    if (qty > coin.quantity) {
      alert('You cannot sell more than you hold.');
      return;
    }

    try {
      await onSell(coin.id, qty, coin.symbol, coin.current_price); // 👈 passes all to backend
      alert(`Successfully sold ${qty} ${coin.name}`);
      onClose();
    } catch (err) {
      console.error('Sell error:', err);
      alert('Failed to sell.');
    }
  };

  if (!isOpen || !coin) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-sm shadow-lg">
        <h2 className="text-lg font-bold mb-4">Sell {coin.name}</h2>
        <p className="mb-2 text-sm text-gray-500">You hold: {coin.quantity}</p>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity to sell"
          min="0"
          max={coin.quantity}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSell}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sell
          </button>
        </div>
      </div>
    </div>
  );
}
