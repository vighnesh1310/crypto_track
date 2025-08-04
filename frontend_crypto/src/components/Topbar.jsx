import React, { useState } from 'react';
import { Bell, ChevronDown, Star, AlertTriangle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { ProfileModal } from './ProfileModal';
import { SettingsModal } from './SettingsModal';
import { useNavigate } from 'react-router-dom'; // ✅ Import

export function Topbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate(); // ✅ Hook to navigate

  const avatarUrl = user?.avatar
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}`;

  return (
    <>
      <div className="w-full bg-white dark:bg-gray-900 shadow px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="hidden sm:block text-lg font-semibold text-gray-700 dark:text-white">
          CryptoTrack
        </div>

        <div className="flex items-center gap-4">
          {/* ⚠️ Alerts */}
          <button
            title="Alerts"
            className="relative text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition"
            onClick={() => navigate('/alerts')} // ✅ Navigate
          >
            <AlertTriangle size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* ⭐ Watchlist */}
          <button
            title="Watchlist"
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition"
            onClick={() => navigate('/watchlist')} // ✅ Navigate
          >
            <Star size={20} />
          </button>

          {/* 👤 User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center text-sm gap-2 text-gray-700 dark:text-white hover:text-indigo-500"
            >
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border"
              />
              <span className="hidden sm:inline text-sm font-medium truncate max-w-[120px]">
                {user?.name || 'User'}
              </span>
              <ChevronDown size={16} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl z-50 backdrop-blur-lg bg-black/15 dark:bg-white/10 text-white shadow-2xl animate-fadeIn">
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowDropdown(false);
                  }}
                  className="block px-4 py-2 hover:bg-black/10 dark:hover:bg-gray-700 w-full text-left"
                >
                  Profile
                </button>

                <button
                  onClick={() => {
                    setShowSettingsModal(true);
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-white/20 transition"
                >
                  Settings
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                  }}
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/20 transition rounded-b-xl"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </>
  );
}
