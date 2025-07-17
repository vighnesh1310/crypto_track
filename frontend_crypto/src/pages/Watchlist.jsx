import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [newCoin, setNewCoin] = useState('');
  const token = localStorage.getItem('token');

  // Fetch watchlist on mount
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/watchlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWatchlist(res.data.watchlist);
      } catch (err) {
        console.error('Failed to load watchlist:', err);
      }
    };

    fetchWatchlist();
  }, [token]);

  // Add coin to backend watchlist
  const addCoin = async (e) => {
    e.preventDefault();
    const coinId = newCoin.toLowerCase();
    if (!coinId || watchlist.includes(coinId)) return;

    try {
      const res = await axios.put(
        'http://localhost:5000/api/watchlist',
        { coinId, action: 'add' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWatchlist(res.data.watchlist); // Update from backend response
      setNewCoin('');
    } catch (err) {
      console.error('Failed to add to watchlist:', err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">⭐ My Watchlist</h1>

      <form onSubmit={addCoin} className="mb-4 flex gap-2">
        <input
          value={newCoin}
          onChange={(e) => setNewCoin(e.target.value)}
          placeholder="Add coin ID (e.g. dogecoin)"
          className="border p-2 w-full"
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Add</button>
      </form>

      <ul className="space-y-3">
        {watchlist.map((coin, i) => (
          <li
            key={i}
            className="p-3 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-center"
          >
            <span className="capitalize">{coin}</span>
            <Link to={`/coin/${coin}`} className="text-blue-500 text-sm hover:underline">
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
