import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

export function Profile() {
  const [user, setUser] = useState({ name: '', email: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await API.get('/user/profile');
        setUser(res.data);
        setAvatarPreview(res.data.avatar || '');
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
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
        await API.put('/user/password', { password });
      }
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      await API.delete('/user');
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (err) {
      toast.error('Account deletion failed');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-800 shadow rounded space-y-6">
      <h2 className="text-2xl font-bold">👤 Profile Settings</h2>

      <div className="flex items-center gap-4">
        {avatarPreview && (
          <img
            src={avatarPreview}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover"
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
        className="w-full p-2 border rounded dark:bg-gray-700"
      />
      <input
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-2 border rounded dark:bg-gray-700"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password (optional)"
        className="w-full p-2 border rounded dark:bg-gray-700"
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleUpdate}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Save Changes
        </button>
        <button
          onClick={handleDelete}
          className="text-red-500 border border-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
