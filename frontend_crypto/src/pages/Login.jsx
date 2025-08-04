import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  const from = location.state?.from || '/dashboard'; // redirect after login

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      setUser(res.data.user); // ✅ update user context

      if (remember) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      toast.success('✅ Login successful! Redirecting...');
      navigate(from, { replace: true }); // ✅ redirect to original route
    } catch (err) {
      console.error('Login error:', err.response);
      toast.error(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 12 }}
        className="w-full max-w-md backdrop-blur-md bg-white/10 dark:bg-white/10 rounded-xl border border-white/20 p-8 shadow-lg"
      >
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">
          🔐 Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="📧 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <div className="flex justify-between items-center text-sm text-white">
            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Remember Me
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-indigo-400 hover:underline"
            >
              {showPassword ? 'Hide' : 'Show'} Password
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-white text-sm mt-4">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
