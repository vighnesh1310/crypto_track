import React, { useEffect, useState } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosInstance';

export function Topbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState({ name: '', avatar: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/user/profile');
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };
    fetchUser();
  }, []);

  const avatarUrl = user.avatar
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}`;

  return (
    <div className="w-full bg-white dark:bg-gray-900 shadow px-6 py-4 flex justify-end items-center">
      <div className="flex items-center gap-4">
        <button className="relative text-gray-600 dark:text-gray-300 hover:text-indigo-500">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center text-sm gap-2 text-gray-700 dark:text-gray-200 hover:text-indigo-500"
          >
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border border-gray-300"
            />
            <span className="hidden sm:inline text-sm font-medium truncate max-w-[120px]">
              {user.name || 'User'}
            </span>
            <ChevronDown size={16} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl z-50 backdrop-blur-lg bg-white/10 dark:bg-white/10 text-white shadow-2xl animate-fadeIn">
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-white/20 transition rounded-t-xl"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 hover:bg-white/20 transition"
              >
                Settings
              </Link>
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
  );
}
