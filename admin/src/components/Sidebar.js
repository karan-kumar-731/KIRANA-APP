import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const NAV = [
  { path: '/', icon: '📊', label: 'Dashboard' },
  { path: '/products', icon: '📦', label: 'Products' },
  { path: '/orders', icon: '🛒', label: 'Orders' },
  { path: '/users', icon: '👥', label: 'Users' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? '✕' : '☰'}
      </button>

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span>🛒</span>
          <div>
            <h2>Kirana</h2>
            <p>Admin Panel</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">👤</div>
            <div>
              <p className="admin-name">{user?.name}</p>
              <p className="admin-role">Administrator</p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>
    </>
  );
}