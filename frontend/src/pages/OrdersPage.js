import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const STATUS_CONFIG = {
  Pending:            { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-300',  icon: '⏳' },
  Confirmed:          { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-300',   icon: '✅' },
  'Out for Delivery': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', icon: '🛵' },
  Delivered:          { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-300',  icon: '🎉' },
  Cancelled:          { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-300',    icon: '❌' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/orders/my`);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-lg">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
        <span className="text-8xl">📦</span>
        <h2 className="font-display text-3xl font-bold text-gray-800">No orders yet!</h2>
        <p className="text-gray-500">Your orders will appear here once you place one.</p>
        <Link
          to="/"
          className="bg-saffron hover:bg-saffron-light text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md hover:-translate-y-0.5"
        >
          Start Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h2 className="font-display text-3xl font-extrabold text-gray-900">📦 My Orders</h2>
          <p className="text-gray-400 text-sm mt-1">Auto-refreshes every 30 seconds</p>
        </div>

        {/* Orders List */}
        <div className="flex flex-col gap-4">
          {orders.map(order => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">

                {/* Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-gray-100">
                  <div>
                    <p className="font-display font-extrabold text-saffron text-lg">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {new Date(order.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-extrabold border-2 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                    {cfg.icon} {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="px-5 py-4 space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">
                        {item.name}{' '}
                        <span className="text-gray-400">× {item.quantity}</span>
                      </span>
                      <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Card Footer */}
                <div className="flex flex-wrap items-end justify-between gap-3 px-5 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="space-y-1 text-xs text-gray-500">
                    <p>🏠 {order.deliveryAddress}</p>
                    <p>💵 {order.paymentMethod} &nbsp;·&nbsp; ⏱️ {order.estimatedDelivery}</p>
                  </div>
                  <p className="font-display font-extrabold text-saffron text-2xl">
                    ₹{order.totalAmount}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}