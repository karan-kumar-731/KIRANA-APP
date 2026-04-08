import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardPage.css';

const API = process.env.REACT_APP_API_URL;

const STAT_CARDS = [
  { key: 'totalRevenue', label: 'Total Revenue', icon: '💰', prefix: '₹', color: '#FF6B00' },
  { key: 'totalOrders', label: 'Total Orders', icon: '🛒', color: '#3B82F6' },
  { key: 'pendingOrders', label: 'Pending Orders', icon: '⏳', color: '#F59E0B' },
  { key: 'deliveredOrders', label: 'Delivered', icon: '✅', color: '#10B981' },
  { key: 'totalProducts', label: 'Products', icon: '📦', color: '#8B5CF6' },
  { key: 'totalUsers', label: 'Customers', icon: '👥', color: '#EC4899' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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

  const STATUS_COLORS = {
    Pending: '#F59E0B', Confirmed: '#3B82F6',
    'Out for Delivery': '#F97316', Delivered: '#10B981', Cancelled: '#EF4444'
  };

  if (loading) return <div className="dash-loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-page">
      <div className="dash-header">
        <div>
          <h1>Dashboard 📊</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
        <button className="btn-seed" onClick={handleSeed}>🌱 Seed Dummy Data</button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {STAT_CARDS.map(card => (
          <div key={card.key} className="stat-card" style={{ borderTop: `4px solid ${card.color}` }}>
            <div className="stat-icon" style={{ background: card.color + '18' }}>{card.icon}</div>
            <div className="stat-info">
              <p className="stat-label">{card.label}</p>
              <h3 className="stat-value" style={{ color: card.color }}>
                {card.prefix || ''}{stats?.[card.key]?.toLocaleString('en-IN') || 0}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="recent-orders-card">
        <div className="card-header">
          <h3>🕐 Recent Orders</h3>
          <a href="/orders" className="view-all">View All →</a>
        </div>
        {recentOrders.length === 0 ? (
          <p className="no-data">No orders yet. Share the shop link with customers!</p>
        ) : (
          <div className="orders-table">
            <div className="table-head">
              <span>Order ID</span>
              <span>Customer</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {recentOrders.map(order => (
              <div key={order._id} className="table-row">
                <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                <span>{order.user?.name || 'N/A'}</span>
                <span className="amount">₹{order.totalAmount}</span>
                <span>
                  <span className="status-dot" style={{ background: STATUS_COLORS[order.status] || '#ccc' }}>
                    {order.status}
                  </span>
                </span>
                <span className="date">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}