// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { fetchCoinDetails, fetchCoinHistory } from '../utils/cryptoAPI';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Sidebar } from '../components/Sidebar';
// import { Topbar } from '../components/Topbar';
// import { Footer } from '../components/Footer';
// import { useSidebar } from '../context/SidebarContext';
// import { useCurrency } from '../context/CurrencyContext';
// import { toast } from 'react-toastify';
// import API from '../utils/api';

// ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

// // ✅ Modal Component
// function QuantityModal({ isOpen, onClose, onConfirm, coinName }) {
//   const [quantity, setQuantity] = useState('');

//   const handleConfirm = () => {
//     const parsed = parseFloat(quantity);
//     if (isNaN(parsed) || parsed <= 0) {
//       toast.error('Please enter a valid quantity.');
//       return;
//     }
//     onConfirm(parsed);
//     setQuantity('');
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80">
//         <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
//           Add {coinName} to Portfolio
//         </h2>
//         <input
//           type="number"
//           step="0.0001"
//           placeholder="Enter quantity"
//           className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white mb-4"
//           value={quantity}
//           onChange={(e) => setQuantity(e.target.value)}
//         />
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleConfirm}
//             className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
//           >
//             Add
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export function CoinDetail() {
//   const { coinId } = useParams();
//   const [coin, setCoin] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [modalOpen, setModalOpen] = useState(false);

//   const { isOpen } = useSidebar();
//   const { currency } = useCurrency();

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       try {
//         const [coinData, priceHistory] = await Promise.all([
//           fetchCoinDetails(coinId, currency.toLowerCase()),
//           fetchCoinHistory(coinId, 7, currency.toLowerCase()),
//         ]);
//         setCoin(coinData);
//         setHistory(priceHistory);
//       } catch (err) {
//         console.error('❌ Coin fetch failed:', err?.response?.data || err.message);
//         setError('Failed to fetch coin data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (coinId) loadData();
//   }, [coinId, currency]);

//   const handleConfirmAdd = async (quantity) => {
//     try {
//       const coinData = {
//         coinId: coin.id,
//         name: coin.name,
//         symbol: coin.symbol,
//         image: coin.image?.large,
//         current_price: coin.market_data?.current_price?.[currency.toLowerCase()] || 0,
//         quantity,
//       };

//       await API.post('/portfolio/add', coinData);
//       toast.success(`${quantity} ${coin.symbol.toUpperCase()} added to your portfolio.`);
//     } catch (error) {
//       console.error('❌ Error adding to portfolio:', error);
//       toast.error('Failed to add coin to portfolio.');
//     } finally {
//       setModalOpen(false);
//     }
//   };

//   const chartData = {
//     labels: history.map((h) => new Date(h[0]).toLocaleDateString()),
//     datasets: [
//       {
//         label: `${coin?.name} Price (${currency})`,
//         data: history.map((h) => h[1]),
//         borderColor: '#6366f1',
//         backgroundColor: 'rgba(99, 102, 241, 0.2)',
//         tension: 0.3,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//     },
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-gray-300">
//         Loading coin details...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen text-red-600">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex">
//       <Sidebar />
//       <div
//         className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
//           isOpen ? 'ml-64' : 'ml-16'
//         }`}
//       >
//         <Topbar />
//         <main className="p-4 sm:p-6 space-y-8">
//           <div className="flex items-center justify-between">
//             <h1 className="text-3xl font-bold">
//               {coin.name} ({coin.symbol.toUpperCase()})
//             </h1>
//             <button
//               onClick={() => setModalOpen(true)}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
//             >
//               ➕ Add to Portfolio
//             </button>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded shadow">
//               <Line data={chartData} options={chartOptions} />
//             </div>

//             <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2 text-sm">
//               <p>
//                 <strong>Current Price:</strong> {currency}{' '}
//                 {coin.market_data?.current_price?.[currency.toLowerCase()]?.toLocaleString() || 'N/A'}
//               </p>
//               <p>
//                 <strong>Market Cap:</strong> {currency}{' '}
//                 {coin.market_data?.market_cap?.[currency.toLowerCase()]?.toLocaleString() || 'N/A'}
//               </p>
//               <p>
//                 <strong>24h Change:</strong>{' '}
//                 {coin.market_data?.price_change_percentage_24h?.toFixed(2) || '0'}%
//               </p>
//               <p>
//                 <strong>Circulating Supply:</strong>{' '}
//                 {coin.market_data?.circulating_supply?.toLocaleString() || 'N/A'}
//               </p>
//               <p>
//                 <strong>Total Volume:</strong> {currency}{' '}
//                 {coin.market_data?.total_volume?.[currency.toLowerCase()]?.toLocaleString() || 'N/A'}
//               </p>
//             </div>
//           </div>

//           {coin.description?.en && (
//             <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
//               <h2 className="text-xl font-semibold mb-2">About {coin.name}</h2>
//               <p
//                 className="text-sm text-gray-600 dark:text-gray-300"
//                 dangerouslySetInnerHTML={{
//                   __html: coin.description.en.split('. ')[0] + '.',
//                 }}
//               />
//             </div>
//           )}
//         </main>
//         <Footer />
//       </div>
//       <QuantityModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onConfirm={handleConfirmAdd}
//         coinName={coin.name}
//       />
//     </div>
//   );
// }

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
import { useCurrency } from '../context/CurrencyContext';
import { toast } from 'react-toastify';
import API from '../utils/api';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

function QuantityModal({ isOpen, onClose, onConfirm, coinName }) {
  const [quantity, setQuantity] = useState('');

  const handleConfirm = () => {
    const parsed = parseFloat(quantity);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error('Please enter a valid quantity.');
      return;
    }
    onConfirm(parsed);
    setQuantity('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Add {coinName} to Portfolio
        </h2>
        <input
          type="number"
          step="0.0001"
          placeholder="Enter quantity"
          className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white mb-4"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export function CoinDetail() {
  const { coinId } = useParams();
  const [coin, setCoin] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { isOpen } = useSidebar();
  const { currency } = useCurrency();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [coinData, priceHistory] = await Promise.all([
          fetchCoinDetails(coinId, currency.toUpperCase()),
          fetchCoinHistory(coinId, 7, currency.toUpperCase()),
        ]);
        setCoin(coinData);
        setHistory(priceHistory);
      } catch (err) {
        console.error('❌ Coin fetch failed:', err.message);
        setError(err.message || 'This coin is not supported by our data provider.');
      } finally {
        setLoading(false);
      }
    };

    if (coinId) loadData();
  }, [coinId, currency]);

  const handleConfirmAdd = async (quantity) => {
  try {
    await API.post('/portfolio', {
      coinId: coin.id,
      symbol: coin.symbol,
      amount: quantity,

    });

    toast.success(`${quantity} ${coin.symbol.toUpperCase()} added to your portfolio.`);
  } catch (error) {
    console.error('❌ Error adding to portfolio:', error);
    toast.error('Failed to add coin to portfolio.');
  } finally {
    setModalOpen(false);
  }
};


    

  const chartData = {
    labels: history.map((h) => new Date(h[0]).toLocaleDateString()),
    datasets: [
      {
        label: `${coin?.name} Price (${currency})`,
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
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-red-600 space-y-4">
        <p className="text-xl font-bold">🚫 {error}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Try searching for another coin from the Market page.
        </p>
        <a
          href="/market"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          🔙 Back to Market
        </a>
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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              {coin.name} ({coin.symbol.toUpperCase()})
            </h1>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
            >
              ➕ Add to Portfolio
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded shadow">
              <Line data={chartData} options={chartOptions} />
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2 text-sm">
              <p>
                <strong>Current Price:</strong> {currency}{' '}
                {coin.market_data?.current_price?.[currency.toLowerCase()]?.toLocaleString() || 'N/A'}
              </p>
              <p>
                <strong>Market Cap:</strong> {currency}{' '}
                {coin.market_data?.market_cap?.[currency.toLowerCase()]?.toLocaleString() || 'N/A'}
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
                <strong>Total Volume:</strong> {currency}{' '}
                {coin.market_data?.total_volume?.[currency.toLowerCase()]?.toLocaleString() || 'N/A'}
              </p>
            </div>
          </div>

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
      <QuantityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmAdd}
        coinName={coin.name}
      />
    </div>
  );
}