import React, { useEffect, useState } from 'react';
import { fetchMarketData } from '../utils/cryptoAPI';
import { MiniSparkline } from './MiniSparkline';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useCurrency } from '../context/CurrencyContext';

export function MarketTable() {
  const [coins, setCoins] = useState([]);
  const { currency } = useCurrency();
  const [isLoading, setIsLoading] = useState(true);

  const currencySymbols = {
    usd: '$',
    inr: '₹',
    eur: '€',
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    setIsLoading(true); // ✅ reset before fetching
    fetchMarketData(currency, 10, true)
      .then((data) => {
        setCoins(data || []);
      })
      .catch((err) => {
        console.error("Error fetching market data:", err);
      })
      .finally(() => {
        setIsLoading(false); // ✅ stop loading after fetch
      });
  }, [currency]);

  if (isLoading) {
    return (
      <div className="text-center p-6 text-gray-600 dark:text-gray-300">
        Loading cryptos...
      </div>
    );
  }

  return (
    <section className="mt-16" data-aos="fade-up">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        📈 Today's Top Cryptos
      </h2>

      <div className="overflow-x-auto rounded-xl backdrop-blur-md bg-white/20 dark:bg-whiteAlpha-50 shadow-lg ring-1 ring-white/20 dark:ring-white/10 transition-all">
        <table className="min-w-full text-sm text-gray-900 dark:text-white">
          <thead>
            <tr className="bg-white/30 dark:bg-gray-800/30 text-left border-b border-white/20">
              <th className="px-6 py-3">Coin</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">24h %</th>
              <th className="px-6 py-3">Chart</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin, index) => (
              <tr
                key={coin.id}
                className="border-b border-white/10 hover:bg-white/10 dark:hover:bg-gray-700 transition"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <td className="px-6 py-4 flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                  {coin.name} ({coin.symbol.toUpperCase()})
                </td>
                <td className="px-6 py-4">
                  {currencySymbols[currency.toLowerCase()] || currency.toUpperCase()}
                  {coin.current_price.toLocaleString()}
                </td>
                <td
                  className={`px-6 py-4 ${
                    coin.price_change_percentage_24h > 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </td>
                <td className="px-6 py-4 w-28">
                  <MiniSparkline data={coin.sparkline_in_7d?.price || []} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
