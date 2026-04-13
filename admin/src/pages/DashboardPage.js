import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = "http://localhost:5000/api";

const STAT_CARDS = [
  { key: 'totalRevenue', label: 'Total Revenue', icon: '💰', prefix: '₹', accent: 'text-blue-600', border: 'border-blue-100', bg: 'bg-blue-50' },
  { key: 'totalOrders', label: 'Total Orders', icon: '🛒', accent: 'text-cyan-600', border: 'border-cyan-100', bg: 'bg-cyan-50' },
  { key: 'pendingOrders', label: 'Pending Orders', icon: '⏳', accent: 'text-amber-600', border: 'border-amber-100', bg: 'bg-amber-50' },
  { key: 'deliveredOrders', label: 'Delivered', icon: '✅', accent: 'text-emerald-600', border: 'border-emerald-100', bg: 'bg-emerald-50' },
  { key: 'totalProducts', label: 'Products', icon: '📦', accent: 'text-violet-600', border: 'border-violet-100', bg: 'bg-violet-50' },
  { key: 'totalUsers', label: 'Customers', icon: '👥', accent: 'text-pink-600', border: 'border-pink-100', bg: 'bg-pink-50' },
];

const STATUS_BADGE = {
  Pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Confirmed: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  'Out for Delivery': 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  Delivered: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Cancelled: 'bg-red-50 text-red-700 ring-1 ring-red-200',
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        axios.get(`${API}/admin/stats`),
        axios.get(`${API}/orders`),
      ]);
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      const { data } = await axios.post(`${API}/admin/seed`);
      alert(data.message);
      fetchData();
    } catch (err) {
      alert('Seed failed: ' + err.message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        Loading...
      </div>
    </div>
  );

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-xs mt-0.5">Welcome back. Here's an overview.</p>
        </div>
        <button
          onClick={handleSeed}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 text-xs font-medium rounded-md transition-colors shadow-sm"
        >
          🌱 Seed Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
        {STAT_CARDS.map(card => (
          <div
            key={card.key}
            className={`bg-white border ${card.border} rounded-xl p-4 flex items-center gap-3 shadow-sm`}
          >
            <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center text-lg flex-shrink-0`}>
              {card.icon}
            </div>
            <div>
              <p className="text-gray-400 text-xs">{card.label}</p>
              <h3 className={`text-xl font-bold font-mono mt-0.5 ${card.accent}`}>
                {card.prefix || ''}{stats?.[card.key]?.toLocaleString('en-IN') || 0}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-gray-800 font-semibold text-sm">Recent Orders</h3>
          <a href="/orders" className="text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors">
            View all →
          </a>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-gray-400 text-sm">No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Order ID</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Customer</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Amount</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-blue-600 font-semibold">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-700 text-xs font-medium">{order.user?.name || 'N/A'}</td>
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-gray-800 font-semibold">₹{order.totalAmount}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_BADGE[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}