import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './OrdersPage.css';

const API = "https://kirana-app-1-qxan.onrender.com/api";

const STATUSES = ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];

const STATUS_COLORS = {
  Pending: { bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
  Confirmed: { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
  'Out for Delivery': { bg: '#fff7ed', color: '#9a3412', border: '#fed7aa' },
  Delivered: { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  Cancelled: { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
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
      toast.success(`Order marked as ${status}!`);
      fetchOrders();
    } catch (err) { toast.error('Failed to update status'); }
  };

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="orders-admin-page">
      <div className="page-header">
        <div>
          <h1>🛒 Orders</h1>
          <p>{orders.length} total orders • Auto-refreshes every 20s</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {['All', ...STATUSES].map(s => (
          <button
            key={s}
            className={`filter-tab ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s}
            <span className="tab-count">
              {s === 'All' ? orders.length : orders.filter(o => o.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading-text">Loading orders...</p>
      ) : filtered.length === 0 ? (
        <div className="no-orders"><p>No orders found.</p></div>
      ) : (
        <div className="orders-list">
          {filtered.map(order => {
            const style = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
            const isExp = expanded === order._id;
            return (
              <div key={order._id} className="order-card-admin">
                <div className="order-card-top" onClick={() => setExpanded(isExp ? null : order._id)}>
                  <div className="order-card-left">
                    <span className="oid">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className="odate">{new Date(order.createdAt).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="order-card-mid">
                    <span className="oname">👤 {order.user?.name || 'N/A'}</span>
                    <span className="ophone">📱 {order.user?.phone || ''}</span>
                  </div>
                  <div className="order-card-right">
                    <span className="ototal">₹{order.totalAmount}</span>
                    <span
                      className="ostatus"
                      style={{ background: style.bg, color: style.color, border: `1.5px solid ${style.border}` }}
                    >
                      {order.status}
                    </span>
                    <span className="expand-icon">{isExp ? '▲' : '▼'}</span>
                  </div>
                </div>

                {isExp && (
                  <div className="order-card-detail">
                    <div className="detail-items">
                      <h4>📋 Items Ordered</h4>
                      {order.items.map((item, i) => (
                        <div key={i} className="detail-item-row">
                          <span>{item.name} × {item.quantity}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="detail-total">
                        <span>Total</span>
                        <span>₹{order.totalAmount}</span>
                      </div>
                    </div>

                    <div className="detail-info">
                      <h4>📍 Delivery Info</h4>
                      <p><strong>Address:</strong> {order.deliveryAddress}</p>
                      <p><strong>Payment:</strong> {order.paymentMethod}</p>
                      <p><strong>Location:</strong> {order.userLocation?.lat?.toFixed(4)}, {order.userLocation?.lng?.toFixed(4)}</p>
                      {order.note && <p><strong>Note:</strong> {order.note}</p>}

                      <h4 style={{ marginTop: '16px' }}>🔄 Update Status</h4>
                      <div className="status-btns">
                        {STATUSES.map(s => (
                          <button
                            key={s}
                            className={`status-btn ${order.status === s ? 'current' : ''}`}
                            onClick={() => updateStatus(order._id, s)}
                            disabled={order.status === s}
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