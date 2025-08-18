// ✅ Register.jsx (with validation + error messages)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import API from '../utils/api';
import { toast } from 'react-toastify';

export function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // clear error on typing
  };

  // ✅ Validation rules
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    else if (formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Enter a valid email address';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    else if (!/[A-Z]/.test(formData.password))
      newErrors.password = 'Password must contain at least one uppercase letter';
    else if (!/[0-9]/.test(formData.password))
      newErrors.password = 'Password must contain at least one number';

    return newErrors;
  };

  // ✅ Form submit
  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await API.post('/auth/register', formData);
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
        <Player autoplay loop src="/assets/lottie-loading.json" style={{ height: '100%', width: '100%' }} />
      </div>

      {/* 🧾 Form Container */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="w-full max-w-md z-10 backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-8 shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">✨ Create Your Account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="👤 Full Name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 rounded bg-white/10 text-white border ${
                errors.name ? 'border-red-500' : 'border-white/20'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="📧 Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 rounded bg-white/10 text-white border ${
                errors.email ? 'border-red-500' : 'border-white/20'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="🔒 Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 rounded bg-white/10 text-white border ${
                errors.password ? 'border-red-500' : 'border-white/20'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Submit */}
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
