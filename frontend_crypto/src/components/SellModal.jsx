import React, { useState, useEffect } from 'react';

export function SellModal({ isOpen, onClose, coin, onSell, getQuantity }) {
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setQuantity('');
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  // ✅ always read latest quantity from holdings
  const currentQty = coin ? getQuantity?.(coin.coinId || coin.id) : 0;

  // Auto-close if coin is fully sold
  useEffect(() => {
    if (isOpen && currentQty === 0) {
      onClose();
    }
  }, [isOpen, currentQty, onClose]);

  const handleSell = async () => {
    const qty = parseFloat(quantity);
    setError('');
    setSuccess('');

    if (!qty || qty <= 0) {
      setError('Enter a valid quantity.');
      return;
    }

    if (qty > currentQty) {
      setError('You cannot sell more than you hold.');
      return;
    }

    try {
      await onSell(coin.coinId || coin.id, qty, coin.symbol, coin.current_price);
      setSuccess(`Successfully sold ${qty} ${coin.name}`);
      setQuantity('');
    } catch (err) {
      console.error('Sell error:', err);
      setError('Failed to sell.');
    }
  };

  if (!isOpen || !coin) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-sm shadow-lg">
        <h2 className="text-lg font-bold mb-4">Sell {coin.name}</h2>
        <p className="mb-2 text-sm text-gray-500">You hold: {currentQty}</p>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity to sell"
          min="0"
          max={currentQty}
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
