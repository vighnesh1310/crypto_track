import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { fetchMarketData } from '../utils/cryptoAPI';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { useSidebar } from '../context/SidebarContext';
import { StarOff } from 'lucide-react';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { toast } from "react-toastify";


export function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [coinData, setCoinData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen } = useSidebar();

  const loadWatchlist = async () => {
    try {
      const res = await API.get('/watchlist');
      const normalized = res.data.watchlist.map((symbol) => symbol.toLowerCase());
      setWatchlist(normalized);
    } catch (err) {
      console.error('❌ Failed to load watchlist:', err);
    }
  };

  const loadCoinData = async () => {
    try {
      const data = await fetchMarketData('INR');
      const filtered = data.filter((coin) => coin?.id && watchlist.includes(coin.id.toLowerCase()));
      setCoinData(filtered);
    } catch (err) {
      console.error('❌ Failed to fetch market data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  useEffect(() => {
    if (watchlist.length > 0) {
      setLoading(true);
      loadCoinData();
    } else {
      setCoinData([]);
      setLoading(false);
    }
  }, [watchlist]);

  const removeFromWatchlist = async (coinId) => {
  const normalizedId = coinId.toLowerCase();

  // ✅ Optimistically remove from both lists
  setWatchlist((prev) => prev.filter((id) => id !== normalizedId));
  setCoinData((prev) => prev.filter((coin) => coin.id.toLowerCase() !== normalizedId));

  // ✅ Show success toast instantly
  toast.success("✅ Removed from Watchlist");

  try {
    await API.put("/watchlist", { coinId: normalizedId, action: "remove" });
  } catch (err) {
    console.error("❌ Failed to update watchlist:", err);
    toast.error("⚠️ Failed to remove. Please try again.");
    // Rollback if API fails
    loadWatchlist();
  }
};


  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'} flex flex-col`}>
        <Topbar />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">⭐ Your Watchlist</h1>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-md animate-pulse">
                  <div className="flex gap-2 items-center mb-2">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-500 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full mt-3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3 mt-2"></div>
                </div>
              ))}
            </div>
          ) : coinData.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No coins in your watchlist.</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.1 },
                },
              }}
            >
              {coinData.map((coin) => (
                <motion.div
                  key={coin.id}
                  className="p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-md"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                      <div>
                        <h2 className="font-semibold text-gray-900 dark:text-white">{coin.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol}</p>
                      </div>
                    </div>
                    <motion.button
  onClick={() => {
    console.log("🟢 Remove clicked:", coin.id);
    removeFromWatchlist(coin.id);
  }}
  whileTap={{ rotate: 20, scale: 0.9 }}
  className="p-2 rounded-full text-red-500 hover:text-red-700"
  title="Remove from Watchlist"
>
  <StarOff className="w-5 h-5 pointer-events-none" />
</motion.button>

                  </div>
                  <div className="mt-2 text-gray-700 dark:text-gray-200">
                    <p>Price: ₹{coin.current_price?.toLocaleString()}</p>
                    <p>
                      24h Change:{' '}
                      <span
                        className={
                          coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                        }
                      >
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
