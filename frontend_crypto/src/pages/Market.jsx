import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchMarketData } from '../utils/cryptoAPI';
import { Star, StarOff } from 'lucide-react';
import API from '../utils/api';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { Footer } from '../components/Footer';
import { useSidebar } from '../context/SidebarContext';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';

export function Market() {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('market_cap');
  const [priceFilter, setPriceFilter] = useState('');
  const [watchlist, setWatchlist] = useState(JSON.parse(localStorage.getItem('watchlist')) || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const { isOpen } = useSidebar();
  const { currency } = useCurrency();
  const printRef = useRef();

  useEffect(() => {
    const savedPage = localStorage.getItem('marketPage');
    if (savedPage) setCurrentPage(Number(savedPage));
  }, []);

  useEffect(() => {
    localStorage.setItem('marketPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    const loadMarketData = async () => {
      try {
        setLoading(true);
        const data = await fetchMarketData(currency.toLowerCase(), 100, true);
        setCoins(data);
        setFilteredCoins(data);
      } catch (err) {
        console.error('Failed to fetch market data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMarketData();
  }, [currency]);

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

  const toggleWatchlist = async (coinSymbol) => {
    const isInWatchlist = watchlist.includes(coinSymbol);
    const updated = isInWatchlist
      ? watchlist.filter((id) => id !== coinSymbol)
      : [...watchlist, coinSymbol];

    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));

    try {
      const token = localStorage.getItem('token');
      await API.put(
        '/watchlist',
        { coinId: coinSymbol, action: isInWatchlist ? 'remove' : 'add' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Watchlist sync failed:', err);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Symbol', 'Price', '24h Change'];
    const rows = filteredCoins.map((coin) => [
      coin.name,
      coin.symbol.toUpperCase(),
      coin.current_price,
      coin.price_change_percentage_24h?.toFixed(2) + '%',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'market_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white flex">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'} flex flex-col`}>
        <Topbar />

        <div className="flex-1 px-4 sm:px-10 py-10">
          <h1 className="text-3xl font-bold mb-6 text-center">📈 Crypto Market</h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center mb-6 print:hidden">
            <input
              type="text"
              placeholder="Search by name or symbol"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 rounded border dark:bg-gray-800 w-full sm:w-auto"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 rounded border dark:bg-gray-800 w-full sm:w-auto"
            >
              <option value="market_cap">Market Cap (High → Low)</option>
              <option value="price">Price (High → Low)</option>
              <option value="change">24h Change (High → Low)</option>
            </select>
            <input
              type="number"
              placeholder={`Max Price (${currency})`}
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="p-2 rounded border dark:bg-gray-800 w-full sm:w-auto"
            />
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
            >
              Export CSV
            </button>
          </div>

          {/* Loading / No Results */}
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">Loading market data...</p>
          ) : filteredCoins.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No coins match your filters.</p>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto print:hidden" ref={printRef}>
                <table className="w-full text-sm table-auto border-collapse rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-indigo-100 dark:bg-gray-700 text-left">
                      <th className="p-3">#</th>
                      <th className="p-3">Coin</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">24h %</th>
                      <th className="p-3">Watchlist</th>
                      <th className="p-3">More</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCoins.map((coin, i) => (
                      <tr key={coin.symbol} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <td className="p-3">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                        <td className="p-3 flex items-center gap-2">
                          <img src={coin.image} alt={coin.symbol} className="w-5 h-5" />
                          {coin.name} ({coin.symbol.toUpperCase()})
                        </td>
                        <td className="p-3">{formatCurrency(coin.current_price, currency)}</td>
                        <td className={`p-3 ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {coin.price_change_percentage_24h?.toFixed(2)}%
                        </td>
                        <td className="p-3">
                          <button onClick={() => toggleWatchlist(coin.symbol)} className="hover:text-yellow-500">
                            {watchlist.includes(coin.symbol)
                              ? <Star className="w-5 h-5 text-yellow-500" />
                              : <StarOff className="w-5 h-5 text-gray-400" />}
                          </button>
                        </td>
                        <td className="p-3">
                          <Link to={`/coin/${coin.symbol}`} className="text-blue-500 hover:underline text-xs">
                            Details →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 print:hidden">
                {paginatedCoins.map((coin, i) => (
                  <div
                    key={coin.symbol}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img src={coin.image} alt={coin.symbol} className="w-6 h-6" />
                        <span className="font-medium">{coin.name} ({coin.symbol.toUpperCase()})</span>
                      </div>
                      <button onClick={() => toggleWatchlist(coin.symbol)}>
                        {watchlist.includes(coin.symbol)
                          ? <Star className="w-5 h-5 text-yellow-500" />
                          : <StarOff className="w-5 h-5 text-gray-400" />}
                      </button>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Price:</span>
                      <span>{formatCurrency(coin.current_price, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>24h %:</span>
                      <span className={coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-right mt-2">
                      <Link to={`/coin/${coin.symbol}`} className="text-blue-500 hover:underline text-xs">
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-6 gap-2 print:hidden flex-wrap">
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
            </>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}
