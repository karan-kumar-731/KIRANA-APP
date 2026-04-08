

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL;

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

  const fields = [
    { key: 'name', label: '👤 Full Name', type: 'text', placeholder: 'Your full name', required: true },
    { key: 'phone', label: '📱 Phone Number', type: 'tel', placeholder: '10-digit phone number', required: true },
    { key: 'address', label: '🏠 Address', type: 'text', placeholder: 'Your delivery address', required: false, optional: true },
    { key: 'password', label: '🔒 Password', type: 'password', placeholder: 'Min 6 characters', required: true },
  ];

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
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-md shadow-green-100">
              🛍️
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1.5">Join Kirana Shop and order groceries easily!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(field => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {field.label}
                  {field.optional && (
                    <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  )}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  required={field.required}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-green-500 rounded-xl text-[15px] bg-gray-50 focus:bg-white transition-all duration-200 outline-none"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 font-bold hover:underline">
              Login here
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="flex items-center justify-center gap-6 mt-5 text-xs text-gray-400 font-medium">
          <span className="flex items-center gap-1">✅ Free delivery</span>
          <span className="flex items-center gap-1">💵 Cash on delivery</span>
          <span className="flex items-center gap-1">⚡ Quick checkout</span>
        </div>
      </div>
    </div>
  );
}