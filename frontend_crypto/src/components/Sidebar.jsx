// components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Wallet,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

export function Sidebar() {
  const location = useLocation();
  const { isOpen, setIsOpen } = useSidebar();

  const isActive = (path) => location.pathname.startsWith(path);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className={`bg-blue-600 dark:bg-gray-900 text-white shadow-lg h-screen fixed z-40 top-0 left-0 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-blue-700 dark:border-gray-700">
        <h2 className={`text-xl font-bold transition-all ${!isOpen && 'hidden'}`}>CryptoTrack</h2>
        <button onClick={toggleSidebar} className="text-white dark:text-gray-300">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex flex-col mt-4 space-y-1 text-sm font-medium">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-4 py-2 transition-colors rounded-r-full ${
            isActive('/dashboard')
              ? 'bg-white text-blue-700 dark:bg-indigo-700 dark:text-white font-semibold'
              : 'hover:bg-blue-500 dark:hover:bg-gray-700'
          }`}
        >
          <LayoutDashboard size={18} />
          {isOpen && <span>Dashboard</span>}
        </Link>

        <Link
          to="/market"
          className={`flex items-center gap-3 px-4 py-2 transition-colors rounded-r-full ${
            isActive('/market')
              ? 'bg-white text-blue-700 dark:bg-indigo-700 dark:text-white font-semibold'
              : 'hover:bg-blue-500 dark:hover:bg-gray-700'
          }`}
        >
          <BarChart3 size={18} />
          {isOpen && <span>Market</span>}
        </Link>

        <Link
          to="/portfolio"
          className={`flex items-center gap-3 px-4 py-2 transition-colors rounded-r-full ${
            isActive('/portfolio')
              ? 'bg-white text-blue-700 dark:bg-indigo-700 dark:text-white font-semibold'
              : 'hover:bg-blue-500 dark:hover:bg-gray-700'
          }`}
        >
          <Wallet size={18} />
          {isOpen && <span>Portfolio</span>}
        </Link>
      </nav>

      <div className="absolute bottom-0 w-full border-t border-blue-700 dark:border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-200 hover:bg-red-100 dark:hover:bg-gray-700"
        >
          <LogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
