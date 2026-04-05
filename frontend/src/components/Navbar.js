import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b-2 border-saffron sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-3xl">🛒</span>
          <span className="font-display font-extrabold text-xl">
            <span className="text-saffron">Kirana</span>
            <span className="text-kgreen">Shop</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="font-semibold text-sm text-gray-600 hover:text-saffron transition-colors"
          >
            Home
          </Link>
          {user && (
            <Link
              to="/orders"
              className="font-semibold text-sm text-gray-600 hover:text-saffron transition-colors"
            >
              My Orders
            </Link>
          )}
          {user ? (
            <>
              <span className="text-sm font-bold text-kgreen bg-green-50 px-3 py-1.5 rounded-full">
                👋 {user.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-1.5 rounded-full transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-bold text-saffron hover:underline"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-bold text-white bg-saffron hover:bg-saffron-light px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Cart + Hamburger */}
        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative bg-orange-50 hover:bg-orange-100 w-11 h-11 rounded-full flex items-center justify-center text-xl transition-colors"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-saffron text-white text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="md:hidden text-gray-700 text-xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 shadow-lg">
          <Link to="/" onClick={() => setMenuOpen(false)} className="font-semibold text-gray-700 hover:text-saffron">🏠 Home</Link>
          {user && (
            <Link to="/orders" onClick={() => setMenuOpen(false)} className="font-semibold text-gray-700 hover:text-saffron">📦 My Orders</Link>
          )}
          {user ? (
            <>
              <span className="text-sm font-bold text-kgreen">👋 {user.name}</span>
              <button onClick={handleLogout} className="text-left text-sm font-bold text-red-600">🚪 Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="font-semibold text-saffron">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="font-bold text-white bg-saffron px-4 py-2 rounded-lg text-center">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}