

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API = "https://kirana-app-1-qxan.onrender.com/api";

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-100 rounded-full opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-100 rounded-full opacity-40" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-md shadow-orange-100">
              🛒
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back!</h2>
            <p className="text-gray-500 text-sm mt-1.5">Login to your Kirana Shop account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📱 Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-400 rounded-xl text-[15px] bg-gray-50 focus:bg-white transition-all duration-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-400 rounded-xl text-[15px] bg-gray-50 focus:bg-white transition-all duration-200 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : 'Login →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            New here?{' '}
            <Link to="/register" className="text-orange-500 font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          🔒 Your data is secure and encrypted
        </p>
      </div>
    </div>
  );
}