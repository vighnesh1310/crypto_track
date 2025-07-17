// components/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../utils/useDarkMode';

export function Header({ showProfileDropdown, showMobileMenu }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, toggleTheme } = useDarkMode();

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const avatarUrl = user?.avatarUrl || 'https://i.pravatar.cc/150?u=default';

  const toggleMenu = () => setIsMobileOpen(!isMobileOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600">CryptoTrack</Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {['/dashboard', '/market', '/portfolio'].map((path, i) => {
            const label = path.replace('/', '').replace(/^\w/, c => c.toUpperCase());
            return (
              <Link
                key={i}
                to={path}
                className="relative group text-gray-700 dark:text-gray-300"
              >
                {label}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
              </Link>
            );
          })}

          {/* Toggle Theme */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="relative group">
              <button className="flex items-center gap-2 focus:outline-none">
                <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-lg py-2 hidden group-hover:block z-50">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Toggle */}
        {showMobileMenu && (
          <button onClick={toggleMenu} className="md:hidden text-gray-700 dark:text-gray-300">
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
  <div className="md:hidden bg-white dark:bg-gray-900 px-4 pb-4 space-y-2 text-sm text-gray-700 dark:text-gray-200">
    <Link to="/dashboard" className="block py-2 border-b border-gray-200 dark:border-gray-700">Dashboard</Link>
    <Link to="/market" className="block py-2 border-b border-gray-200 dark:border-gray-700">Market</Link>
    <Link to="/portfolio" className="block py-2 border-b border-gray-200 dark:border-gray-700">Portfolio</Link>
    <button
      onClick={toggleTheme}
      className="block w-full text-left py-2 border-b border-gray-200 dark:border-gray-700"
    >
      {theme === 'dark' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
    </button>
    {showProfileDropdown && (
      <>
        <Link to="/profile" className="block py-2 border-b border-gray-200 dark:border-gray-700">Profile</Link>
        <Link to="/settings" className="block py-2 border-b border-gray-200 dark:border-gray-700">Settings</Link>
        <button onClick={handleLogout} className="block w-full text-left py-2 text-inherit">Logout</button>
      </>
    )}
  </div>
)}


      {/* Floating "Get Started" Button */}
      <Link
        to="/login"
        className="fixed bottom-6 right-6 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition z-50"
      >
        🚀 Get Started
      </Link>
    </header>
  );
}