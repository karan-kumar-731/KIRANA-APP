
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;
const STATUS_CONFIG = {
  Pending:            { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-500',  icon: '⏳', label: 'Pending' },
  Confirmed:          { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-500',   icon: '✅', label: 'Confirmed' },
  'Out for Delivery': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500', icon: '🛵', label: 'Out for Delivery' },
  Delivered:          { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500',  icon: '🎉', label: 'Delivered' },
  Cancelled:          { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200',    dot: 'bg-red-500',    icon: '❌', label: 'Cancelled' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-32 h-32 bg-orange-50 rounded-3xl flex items-center justify-center border-2 border-orange-100">
          <span className="text-6xl">📦</span>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">No orders yet!</h2>
          <p className="text-gray-500 text-sm">Your orders will appear here once you place one.</p>
        </div>
        <Link
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          Start Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              {orders.length} order{orders.length !== 1 ? 's' : ''} · Auto-refreshes every 30s
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Live tracking
          </div>
        </div>

        {/* Orders List */}
        <div className="flex flex-col gap-4">
          {orders.map(order => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
              >
                {/* Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-lg">
                      📦
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {new Date(order.createdAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${order.status !== 'Delivered' && order.status !== 'Cancelled' ? 'animate-pulse' : ''}`} />
                    {cfg.icon} {cfg.label}
                  </span>
                </div>

                {/* Items */}
                <div className="px-5 py-4 space-y-2.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 bg-orange-300 rounded-full shrink-0" />
                        <span className="text-gray-700 font-medium truncate">{item.name}</span>
                        <span className="text-gray-400 shrink-0">× {item.quantity}</span>
                      </div>
                      <span className="font-semibold text-gray-900 shrink-0 ml-4">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Card Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="space-y-1 text-xs text-gray-500">
                    <p className="flex items-center gap-1.5">
                      <span>🏠</span> {order.deliveryAddress}
                    </p>
                    <p className="flex items-center gap-3">
                      <span>💵 {order.paymentMethod}</span>
                      <span>⏱️ {order.estimatedDelivery}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-0.5">Total Amount</p>
                    <p className="font-bold text-orange-500 text-2xl">₹{order.totalAmount}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}