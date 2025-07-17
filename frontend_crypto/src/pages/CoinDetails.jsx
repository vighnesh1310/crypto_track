import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCoinDetails, fetchCoinHistory } from '../utils/cryptoAPI';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { Footer } from '../components/Footer';
import { useSidebar } from '../context/SidebarContext';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export function CoinDetail() {
  const { coinId } = useParams();
  const [coin, setCoin] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isOpen } = useSidebar();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [coinData, priceHistory] = await Promise.all([
          fetchCoinDetails(coinId),
          fetchCoinHistory(coinId, 7),
        ]);
        setCoin(coinData);
        setHistory(priceHistory);
      } catch (err) {
        console.error('❌ Coin fetch failed:', err?.response?.data || err.message);
        setError('Failed to fetch coin data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (coinId) loadData();
  }, [coinId]);

  const chartData = {
    labels: history.map((h) => new Date(h[0]).toLocaleDateString()),
    datasets: [
      {
        label: `${coin?.name} Price (USD)`,
        data: history.map((h) => h[1]),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-gray-300">
        Loading coin details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isOpen ? 'ml-64' : 'ml-16'
        }`}
      >
        <Topbar />
        <main className="p-4 sm:p-6 space-y-8">
          <h1 className="text-3xl font-bold">
            {coin.name} ({coin.symbol.toUpperCase()})
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded shadow">
              <Line data={chartData} options={chartOptions} />
            </div>

            {/* Info */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2 text-sm">
              <p>
                <strong>Current Price:</strong> ${coin.market_data?.current_price?.usd?.toLocaleString() || 'N/A'}
              </p>
              <p>
                <strong>Market Cap:</strong> ${coin.market_data?.market_cap?.usd?.toLocaleString() || 'N/A'}
              </p>
              <p>
                <strong>24h Change:</strong>{' '}
                {coin.market_data?.price_change_percentage_24h?.toFixed(2) || '0'}%
              </p>
              <p>
                <strong>Circulating Supply:</strong>{' '}
                {coin.market_data?.circulating_supply?.toLocaleString() || 'N/A'}
              </p>
              <p>
                <strong>Total Volume:</strong> ${coin.market_data?.total_volume?.usd?.toLocaleString() || 'N/A'}
              </p>
            </div>
          </div>

          {/* Description */}
          {coin.description?.en && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">About {coin.name}</h2>
              <p
                className="text-sm text-gray-600 dark:text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: coin.description.en.split('. ')[0] + '.',
                }}
              />
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
