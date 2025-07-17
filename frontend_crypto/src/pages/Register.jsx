// ✅ Register.jsx (Modern UI with animation + Lottie)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import API from '../utils/api';
import { toast } from 'react-toastify';

export function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/register', { name, email, password });
      toast.success('✅ Registration successful! Please login.');
      window.location.href = '/login';
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 relative overflow-hidden">
      {/* 🔁 Lottie animation background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <Player
          autoplay
          loop
          src="/assets/lottie-loading.json" // or use a CDN link
          style={{ height: '100%', width: '100%' }}
        />
      </div>

      {/* 🧾 Form Container */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="w-full max-w-md z-10 backdrop-blur-md bg-white/10 dark:bg-white/10 rounded-xl border border-white/20 p-8 shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          ✨ Create Your Account
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="👤 Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <input
            type="email"
            placeholder="📧 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <input
            type="password"
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded transition"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>

          <p className="text-center text-white text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
