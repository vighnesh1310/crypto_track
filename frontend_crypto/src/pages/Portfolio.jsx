
import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Topbar } from '../components/Topbar';
import { Footer } from '../components/Footer';
import { fetchMarketData } from '../utils/cryptoAPI';
import { Sidebar } from '../components/Sidebar';
import { BuyModal } from '../components/BuyModal';
import { useSidebar } from '../context/SidebarContext';
import { calculatePortfolioStats } from '../utils/portfolioUtils';
import { useCurrency } from '../context/CurrencyContext';
import { Pie, Line } from 'react-chartjs-2';
import { SellModal } from '../components/SellModal';
import { Transaction } from './Transaction';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export function Portfolio() {
  const [holdings, setHoldings] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen } = useSidebar();
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coinToSell, setCoinToSell] = useState(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const { currency } = useCurrency();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);

  const fetchPortfolio = async () => {
    try {
      const res = await axiosInstance.get('/portfolio');
      const userHoldings = Array.isArray(res.data) ? res.data : [];
      setHoldings(userHoldings);

      const coinIds = userHoldings.map((h) => h.coinId.toLowerCase());
      if (coinIds.length > 0) {
        const marketRes = await fetchMarketData(currency.toLowerCase());
        const filtered = marketRes.filter((coin) =>
          coinIds.includes(coin.id?.toLowerCase())
        );
        setMarketData(filtered);
      } else {
        setMarketData([]);
      }
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      toast.error(`Failed to load portfolio: ${err.response?.data?.message || 'Network error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 60000);
    return () => clearInterval(interval);
  }, [currency]);

  const getQuantity = (coinId) => {
    const holding = holdings.find((h) => h.coinId.toLowerCase() === coinId.toLowerCase());
    return holding ? holding.quantity || 0 : 0;
  };

  const totalValue = useMemo(() => {
    return marketData.reduce((acc, coin) => {
      const quantity = getQuantity(coin.id);
      return acc + quantity * (coin.current_price ?? 0);
    }, 0);
  }, [marketData, holdings]);

  const handleSell = async (coinId, quantity, symbol, price) => {
    try {
      await axiosInstance.post('/portfolio/update', {
        coinId,
        symbol,
        quantity,
        price,
        type: 'sell',
      });
      toast.success(`Sold ${quantity} ${symbol}`);
      await fetchPortfolio();
    } catch (err) {
      console.error(`Sell error for ${coinId}:`, err);
      toast.error(
        `Failed to sell ${coinId}: ${err.response?.data?.error || 'Network error'}`
      );
    }
  };

  const handleBuy = async (coinId, quantityToBuy) => {
    const coin = marketData.find((c) => c.id === coinId);
    if (!coin) return alert('Coin not found');

    try {
      await axiosInstance.post('/portfolio/update', {
        coinId: coin.id,
        symbol: coin.symbol,
        quantity: quantityToBuy,
        price: coin.current_price,
        type: 'buy',
      });

      toast.success(`Bought ${quantityToBuy} ${coin.symbol}`);
      await fetchPortfolio();
    } catch (err) {
      console.error('Buy failed:', err);
      toast.error(err.response?.data?.error || 'Buy failed');
    } finally {
      setSelectedCoin(null);
      setIsModalOpen(false);
    }
  };

  const exportToCSV = () => {
    const csvData = marketData.map((coin) => {
      const quantity = getQuantity(coin.id);
      const value = quantity * coin.current_price;
      return {
        Name: coin.name,
        Symbol: coin.symbol.toUpperCase(),
        Quantity: quantity,
        'Current Price': coin.current_price,
        'Total Value': value,
      };
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'portfolio.csv');
  };

  const pieData = useMemo(() => ({
    labels: marketData.map((coin) => coin.name),
    datasets: [
      {
        label: 'Value',
        data: marketData.map((coin) => getQuantity(coin.id) * coin.current_price),
        backgroundColor: marketData.map((_, i) =>
          `hsl(${(i * 45) % 360}, 70%, 60%)`
        ),
        borderWidth: 1,
      },
    ],
  }), [marketData, holdings]);

  const lineData = useMemo(() => ({
    labels: marketData.map((coin) => coin.name),
    datasets: [
      {
        label: 'Holding Value',
        data: marketData.map((coin) => getQuantity(coin.id) * coin.current_price),
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.2)',
        tension: 0.4,
      },
    ],
  }), [marketData, holdings]);

  if (isLoading) {
    return <div className="text-center p-6 text-gray-600 dark:text-gray-300">Loading portfolio...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white flex">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'} flex flex-col`}>
        <Topbar />
        <div className="flex-1 px-4 sm:px-8 py-8">
          <h2 className="text-3xl font-bold mb-4">📊 My Portfolio</h2>
          <div className="text-lg font-semibold mb-6 text-green-600 dark:text-green-400">
            Total Value: {formatCurrency(totalValue)}
          </div>

          <button
            onClick={exportToCSV}
            className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-md"
          >
            ⬇️ Export to CSV
          </button>

          {marketData.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400">No coins in your portfolio.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketData.map((coin) => {
                const quantity = getQuantity(coin.id);
                const value = quantity * coin.current_price;
                return (
                  <div
                    key={coin.id}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md transition hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-4 min-w-[150px]">
                      <img src={coin.image} alt={`${coin.name} logo`} className="w-10 h-10" />
                      <div>
                        <div className="font-semibold text-lg">{coin.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Qty: {quantity}</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                      <div className="text-gray-800 dark:text-gray-100 font-semibold">
                        {formatCurrency(value)}
                      </div>
                      <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            setSelectedCoin(coin);
                            setIsModalOpen(true);
                          }}
                          className="w-full sm:w-auto px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded"
                        >
                          Buy
                        </button>
                        <button
                          onClick={() => {
                            setCoinToSell({ ...coin, quantity });
                            setIsSellModalOpen(true);
                          }}
                          className="w-full sm:w-auto px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                        >
                          Sell
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {marketData.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 mt-10">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md min-h-[400px]">
                <h3 className="text-lg font-semibold mb-4">💹 Portfolio Breakdown</h3>
                <div className="relative h-[300px] w-full">
                  <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md min-h-[400px]">
                <h3 className="text-lg font-semibold mb-4">📈 Holdings Chart</h3>
                <div className="relative h-[300px] w-full">
                  <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          )}

          <div className="mt-10">
            <Transaction />
          </div>

         

          <BuyModal
            coin={selectedCoin}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedCoin(null);
            }}
            onBuy={handleBuy}
          />

          <SellModal
            coin={coinToSell}
            isOpen={isSellModalOpen}
            onClose={() => {
              setCoinToSell(null);
              setIsSellModalOpen(false);
            }}
            onSell={handleSell}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
}
