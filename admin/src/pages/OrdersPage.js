import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = "http://localhost:5000/api";

const STATUSES = ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];

const STATUS_BADGE = {
  Pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Confirmed: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  'Out for Delivery': 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  Delivered: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Cancelled: 'bg-red-50 text-red-700 ring-1 ring-red-200',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchOrders();
    const iv = setInterval(fetchOrders, 20000);
    return () => clearInterval(iv);
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/orders`);
      setOrders(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`${API}/orders/${orderId}/status`, { status });
      toast.success(`Marked as ${status}`);
      fetchOrders();
    } catch (err) { toast.error('Failed to update status'); }
  };

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-gray-900">Orders</h1>
        <p className="text-gray-400 text-xs mt-0.5">{orders.length} total · auto-refreshes every 20s</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {['All', ...STATUSES].map(s => {
          const count = s === 'All' ? orders.length : orders.filter(o => o.status === s).length;
          const isActive = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-500 hover:text-gray-800 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {s}
              <span className={`text-xs px-1.5 py-0 rounded-full font-semibold ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Loading orders...
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-12 text-center shadow-sm">
          <p className="text-gray-400 text-sm">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {filtered.map(order => {
            const isExp = expanded === order._id;
            return (
              <div key={order._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all">
                {/* Order Header Row */}
                <div
                  className="flex flex-wrap items-center gap-3 px-4 py-3 cursor-pointer select-none"
                  onClick={() => setExpanded(isExp ? null : order._id)}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs text-blue-600 font-semibold">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className="text-gray-400 text-xs mt-0.5">{new Date(order.createdAt).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-gray-800 text-xs font-semibold">{order.user?.name || 'N/A'}</span>
                    <span className="text-gray-400 text-xs mt-0.5">{order.user?.phone || ''}</span>
                  </div>

                  <div className="flex items-center gap-2.5 ml-auto">
                    <span className="font-mono text-gray-800 text-xs font-bold">₹{order.totalAmount}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_BADGE[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                    <span className="text-gray-400 text-xs">{isExp ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExp && (
                  <div className="border-t border-gray-100 px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50">
                    {/* Items */}
                    <div>
                      <h4 className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2.5">Items Ordered</h4>
                      <div className="space-y-1.5">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-200 last:border-0">
                            <span className="text-gray-600 text-xs">{item.name} × {item.quantity}</span>
                            <span className="font-mono text-gray-800 text-xs font-semibold">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-1.5">
                          <span className="text-gray-600 text-xs font-semibold">Total</span>
                          <span className="font-mono text-blue-600 font-bold text-sm">₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Info + Status Update */}
                    <div>
                      <h4 className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2.5">Delivery Info</h4>
                      <div className="space-y-1 text-xs">
                        <p className="text-gray-600"><span className="text-gray-400">Address:</span> {order.deliveryAddress}</p>
                        <p className="text-gray-600"><span className="text-gray-400">Payment:</span> {order.paymentMethod}</p>
                        <p className="text-gray-600 font-mono text-xs">
                          <span className="text-gray-400 font-sans">Location:</span> {order.userLocation?.lat?.toFixed(4)}, {order.userLocation?.lng?.toFixed(4)}
                        </p>
                        {order.note && <p className="text-gray-600"><span className="text-gray-400">Note:</span> {order.note}</p>}
                      </div>

                      <h4 className="text-gray-600 text-xs font-semibold uppercase tracking-wide mt-4 mb-2.5">Update Status</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {STATUSES.map(s => (
                          <button
                            key={s}
                            onClick={() => updateStatus(order._id, s)}
                            disabled={order.status === s}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                              order.status === s
                                ? `${STATUS_BADGE[s]} cursor-default`
                                : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}