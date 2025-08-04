import React, { useEffect, useState } from 'react';
import API from '../utils/api'; // your authenticated axios instance
import { fetchMarketData } from '../utils/cryptoAPI'; // fetches from CoinGecko
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { useSidebar } from '../context/SidebarContext';
import { StarOff } from 'lucide-react';

export function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [coinData, setCoinData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen } = useSidebar();

  // Load watchlist from backend
  const loadWatchlist = async () => {
    try {
      const res = await API.get('/watchlist');
      setWatchlist(res.data.watchlist);
    } catch (err) {
      console.error('Failed to load watchlist:', err);
    }
  };

  // Fetch coin data from CoinGecko
  const loadCoinData = async () => {
    try {
      const data = await fetchMarketData();
      const filtered = data.filter((coin) => watchlist.includes(coin.id));
      setCoinData(filtered);
    } catch (err) {
      console.error('Failed to fetch market data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  useEffect(() => {
    if (watchlist.length > 0) {
      loadCoinData();
    } else {
      setCoinData([]);
      setLoading(false);
    }
  }, [watchlist]);

  // Remove coin from watchlist
  const removeFromWatchlist = async (coinId) => {
    try {
      const res = await API.put('/watchlist', { coinId, action: 'remove' });
      setWatchlist(res.data.watchlist);
    } catch (err) {
      console.error('Failed to update watchlist:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />

       <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'} flex flex-col`}>
        <Topbar />

        <main className="p-6 w-full max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">⭐ Your Watchlist</h1>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          ) : coinData.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No coins in your watchlist.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coinData.map((coin) => (
                <div key={coin.id} className="p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-md">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                      <div>
                        <h2 className="font-semibold text-gray-900 dark:text-white">{coin.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromWatchlist(coin.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove from Watchlist"
                    >
                      <StarOff />
                    </button>
                  </div>
                  <div className="mt-2 text-gray-700 dark:text-gray-200">
                    <p>Price: ₹{coin.current_price.toLocaleString()}</p>
                    <p>
                      24h Change:{' '}
                      <span
                        className={
                          coin.price_change_percentage_24h >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }
                      >
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
