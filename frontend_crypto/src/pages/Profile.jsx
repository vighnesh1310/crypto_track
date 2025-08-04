import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import { useUser } from '../context/UserContext';

export function Profile({ inModal = false }) {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/user/profile');
        setUser(res.data);
        setAvatarPreview(res.data.avatar || '');
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image must be under 3MB');
      return;
    }

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 512,
        useWebWorker: true,
      });

      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
        setUser((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      toast.error('Image compression failed');
    }
  };

  const handleUpdate = async () => {
    try {
      await API.put('/user/profile', user);

      if (password) {
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return;
        }

        await API.put('/user/password', { password });

        toast.success('Password updated. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async () => {
    if (confirmDelete !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    try {
      await API.delete('/user');
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (err) {
      toast.error('Account deletion failed');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`space-y-6 transition-all duration-500 ease-in-out animate-fadeIn ${
        inModal ? '' : 'p-6 max-w-xl mx-auto'
      } bg-white dark:bg-gray-800 shadow rounded`}
    >
      <div className="flex gap-4 border-b pb-2">
        {['profile', 'security', 'danger'].map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1 rounded font-medium transition ${
              activeTab === tab
                ? tab === 'danger'
                  ? 'bg-red-600 text-white'
                  : 'bg-indigo-600 text-white'
                : tab === 'danger'
                ? 'text-red-500 hover:bg-red-100 dark:hover:bg-red-800 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'profile' && 'Profile'}
            {tab === 'security' && 'Security'}
            {tab === 'danger' && 'Danger Zone'}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">👤 Profile</h2>
          <div className="flex items-center gap-4">
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover transition-transform duration-300 hover:scale-105"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="text-sm text-gray-700 dark:text-gray-200"
            />
          </div>

          <input
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />

          <button
            onClick={handleUpdate}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full"
          >
            Save Changes
          </button>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">🔐 Security</h2>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password (optional)"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-300"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {password && password.length < 6 && (
            <p className="text-sm text-red-500">
              Password must be at least 6 characters
            </p>
          )}

          <button
            onClick={handleUpdate}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full"
          >
            Save Password
          </button>
        </div>
      )}

      {activeTab === 'danger' && (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">⚠️ Danger Zone</h2>
          <input
            type="text"
            placeholder='Type "DELETE" to confirm account deletion'
            value={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleDelete}
            disabled={confirmDelete !== 'DELETE'}
            className={`w-full px-4 py-2 rounded ${
              confirmDelete === 'DELETE'
                ? 'text-red-500 border border-red-500 hover:bg-red-500 hover:text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
}
