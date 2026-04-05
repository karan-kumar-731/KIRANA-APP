import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const CATEGORIES = ['All', 'Atta & Rice', 'Dal & Pulses', 'Oil & Ghee', 'Spices', 'Snacks', 'Dairy', 'Beverages', 'Soap & Cleaning', 'Other'];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/products`, { params: { category } });
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-br from-saffron via-orange-500 to-amber-400 overflow-hidden">
        {/* Decorative circles — behind everything */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 right-24 w-44 h-44 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-8">
          {/* Badge */}
          <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/25 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            🌿 Fresh &amp; Local
          </span>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-white leading-tight mb-4 text-4xl md:text-5xl lg:text-6xl">
            Apni <span className="text-yellow-100">Kirana Shop</span>
            <br />Ab Online!
          </h1>

          <p className="text-white/90 text-base md:text-lg mb-7 max-w-lg leading-relaxed">
            Order groceries from your trusted local shop. Delivered within 1 km, minimum order ₹100.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            {[['📍', '1 KM Delivery'], ['💵', 'COD Available'], ['⚡', '30-45 Min']].map(([icon, label]) => (
              <span
                key={label}
                className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl"
              >
                {icon} {label}
              </span>
            ))}
          </div>
        </div>
      </div>
<div className="w-full px-2">

        {/* ── Search Bar ── */}
        <div className="flex items-center gap-3 bg-white border-2 border-gray-100 focus-within:border-saffron rounded-2xl px-4 py-3 my-7 shadow-sm transition-colors">
          <span className="text-xl text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search products... (e.g. atta, dal, oil)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-[15px] font-body"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors"
            >✕</button>
          )}
        </div>

        {/* ── Category Tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-7" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold border-2 shrink-0 transition-all ${
                category === cat
                  ? 'bg-saffron text-white border-saffron shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-saffron hover:text-saffron'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Products Grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-16">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-72 rounded-2xl shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-4">🛍️</div>
            <h3 className="font-display text-2xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-400">Try a different category or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-16">
            {filtered.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}