import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/login`, form);
      login(data);
      toast.success(`Welcome back, ${data.name}! 🎉`);
      if (data.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-6xl block mb-3">🛒</span>
          <h2 className="font-display text-3xl font-extrabold text-gray-900">Welcome Back!</h2>
          <p className="text-gray-500 text-sm mt-1">Login to your Kirana Shop account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">📱 Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-saffron rounded-xl text-[15px] bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">🔒 Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-saffron rounded-xl text-[15px] bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-saffron hover:bg-saffron-light disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 mt-2"
          >
            {loading ? '⏳ Logging in...' : 'Login →'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          New here?{' '}
          <Link to="/register" className="text-saffron font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}