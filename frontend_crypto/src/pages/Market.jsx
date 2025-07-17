import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchMarketData } from '../utils/cryptoAPI';
import { Star, StarOff } from 'lucide-react';
import { MiniSparkline } from '../components/MiniSparkline';
import API from '../utils/api';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../context/SidebarContext';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';

export function Market() {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('market_cap');
  const [priceFilter, setPriceFilter] = useState('');
  const [watchlist, setWatchlist] = useState(
    JSON.parse(localStorage.getItem('watchlist')) || []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { isOpen } = useSidebar();
  const tableRef = useRef();

  useEffect(() => {
    fetchMarketData('usd', 100, true).then((data) => {
      setCoins(data);
      setFilteredCoins(data);
    });
  }, []);

  useEffect(() => {
    let data = [...coins];

    if (search) {
      data = data.filter(
        (coin) =>
          coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (priceFilter) {
      data = data.filter((coin) => coin.current_price <= parseFloat(priceFilter));
    }

    data.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.current_price - a.current_price;
        case 'change':
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        case 'market_cap':
        default:
          return b.market_cap - a.market_cap;
      }
    });

    setFilteredCoins(data);
    setCurrentPage(1);
  }, [search, sortBy, priceFilter, coins]);

  const totalPages = Math.ceil(filteredCoins.length / itemsPerPage);
  const paginatedCoins = filteredCoins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleWatchlist = async (coinId) => {
    const isInWatchlist = watchlist.includes(coinId);
    const updated = isInWatchlist
      ? watchlist.filter((id) => id !== coinId)
      : [...watchlist, coinId];

    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));

    try {
      const token = localStorage.getItem('token');
      await API.put(
        '/watchlist',
        { coinId, action: isInWatchlist ? 'remove' : 'add' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Watchlist sync failed:', err);
    }
  };

  const handlePrint = useReactToPrint({ content: () => tableRef.current });

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredCoins);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MarketData');
    XLSX.writeFile(wb, 'market_data.xlsx');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white flex">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'} px-4 sm:px-10 py-10`}>
        <h1 className="text-3xl font-bold mb-6 text-center">📈 Crypto Market</h1>

        {/* 🔍 Search + Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-6 print:hidden">
          <input
            type="text"
            placeholder="Search by name or symbol"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded border dark:bg-gray-800"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 rounded border dark:bg-gray-800"
          >
            <option value="market_cap">Sort by Market Cap</option>
            <option value="price">Sort by Price</option>
            <option value="change">Sort by 24h Change</option>
          </select>
          <input
            type="number"
            placeholder="Max Price"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="p-2 rounded border dark:bg-gray-800"
          />
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Export Excel
          </button>
        </div>

        {/* 📊 Market Table */}
        <div className="overflow-x-auto" ref={tableRef}>
          <table className="w-full text-sm table-auto border-collapse rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-indigo-100 dark:bg-gray-700 text-left">
                <th className="p-3">#</th>
                <th className="p-3">Coin</th>
                <th className="p-3">Price</th>
                <th className="p-3">24h %</th>
                <th className="p-3 print:hidden">Chart</th>
                <th className="p-3 print:hidden">Watchlist</th>
                <th className="p-3 print:hidden">More</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCoins.map((coin, i) => (
                <tr
                  key={coin.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <td className="p-3">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td className="p-3 flex items-center gap-2">
                    <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </td>
                  <td className="p-3">${coin.current_price.toLocaleString()}</td>
                  <td
                    className={`p-3 ${
                      coin.price_change_percentage_24h >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                  <td className="p-3 w-28 print:hidden">
                    <MiniSparkline data={coin.sparkline_in_7d?.price || []} />
                  </td>
                  <td className="p-3 print:hidden">
                    <button
                      onClick={() => toggleWatchlist(coin.id)}
                      className="hover:text-yellow-500"
                      title={
                        watchlist.includes(coin.id)
                          ? 'Remove from Watchlist'
                          : 'Add to Watchlist'
                      }
                    >
                      {watchlist.includes(coin.id) ? (
                        <Star className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <StarOff className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="p-3 print:hidden">
                    <Link
                      to={`/coin/${coin.id}`}
                      className="text-blue-500 hover:underline text-xs"
                    >
                      Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔢 Pagination */}
        <div className="flex justify-center mt-6 gap-2 print:hidden">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
