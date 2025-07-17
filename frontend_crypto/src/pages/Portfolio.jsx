// pages/Portfolio.jsx
import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { Footer } from '../components/Footer';
import { useSidebar } from '../context/SidebarContext';
import { useNavigate } from 'react-router-dom';

export function Portfolio() {
  const [holdings] = useState([
    { name: 'Bitcoin', symbol: 'BTC', amount: 1.2, price: 30000 },
    { name: 'Ethereum', symbol: 'ETH', amount: 5, price: 2000 },
    { name: 'Cardano', symbol: 'ADA', amount: 2000, price: 0.35 },
  ]);

  const totalValue = holdings.reduce((acc, h) => acc + h.amount * h.price, 0);
   const navigate = useNavigate();
    const { isOpen } = useSidebar();
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) navigate('/login');
    }, [navigate]);

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
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold mb-2">My Portfolio</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Overview of your current cryptocurrency holdings.
            </p>
          </div>

          {/* Portfolio Summary */}
          <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Portfolio Summary</h2>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              ${totalValue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Value (USD)</p>
          </div>

          {/* Holdings Table */}
          <div className="bg-white dark:bg-gray-800 rounded shadow p-6 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">Coin Holdings</h2>
            <table className="min-w-full text-sm">
              <thead className="text-left border-b dark:border-gray-700">
                <tr>
                  <th className="py-2">Coin</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((coin, idx) => (
                  <tr key={idx} className="border-b dark:border-gray-700">
                    <td className="py-2">{coin.name} ({coin.symbol})</td>
                    <td>{coin.amount}</td>
                    <td>${coin.price.toLocaleString()}</td>
                    <td>${(coin.amount * coin.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
