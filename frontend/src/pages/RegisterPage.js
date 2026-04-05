import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', phone: '', password: '', address: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/register`, form);
      login(data);
      toast.success(`Account created! Welcome, ${data.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-6xl block mb-3">🛍️</span>
          <h2 className="font-display text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="text-gray-500 text-sm mt-1">Join Kirana Shop and order groceries easily!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">👤 Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-saffron rounded-xl text-[15px] bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">📱 Phone Number</label>
            <input
              type="tel"
              placeholder="10-digit phone number"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-saffron rounded-xl text-[15px] bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              🏠 Address <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Your delivery address"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-saffron rounded-xl text-[15px] bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">🔒 Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
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
            {loading ? '⏳ Creating account...' : 'Sign Up →'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-saffron font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}