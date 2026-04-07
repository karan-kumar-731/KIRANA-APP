

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = "https://kirana-app-s0v1.onrender.com/api";
const CATEGORIES = ['All', 'Atta & Rice', 'Dal & Pulses', 'Oil & Ghee', 'Spices', 'Snacks', 'Dairy', 'Beverages', 'Soap & Cleaning', 'Other'];

const CATEGORY_ICONS = {
  'All': '🛍️',
  'Atta & Rice': '🌾',
  'Dal & Pulses': '🫘',
  'Oil & Ghee': '🫙',
  'Spices': '🌶️',
  'Snacks': '🍿',
  'Dairy': '🥛',
  'Beverages': '☕',
  'Soap & Cleaning': '🧼',
  'Other': '📦',
};

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
      <div className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="absolute bottom-6 right-32 w-32 h-32 bg-white/5 rounded-full" />
        </div>

        <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="max-w-xl">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/25 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
              🌿 Fresh &amp; Local · Open Now
            </span>

            {/* Headline */}
            <h1 className="font-bold text-white leading-tight mb-4 text-4xl md:text-5xl lg:text-6xl tracking-tight">
              Apni <span className="text-yellow-200 italic">RK Kirana Shop</span>
              <br />Ab Online! 🚀
            </h1>

            <p className="text-white/85 text-base md:text-lg mb-8 leading-relaxed">
              Order groceries from your trusted local shop. Delivered within 1 km, minimum order ₹100.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2.5">
              {[['📍', '1 KM Delivery Zone'], ['💵', 'Cash on Delivery'], ['⚡', '30–45 Min Delivery']].map(([icon, label]) => (
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
      </div>

      {/* ── Content Area ── */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Search Bar ── */}
        <div className="my-6">
          <div className="flex items-center gap-3 bg-white border-2 border-gray-100 focus-within:border-orange-400 rounded-2xl px-4 h-14 shadow-sm transition-all duration-200 focus-within:shadow-md">
            <span className="text-xl text-gray-400 shrink-0">🔍</span>
            <input
              type="text"
              placeholder="Search for atta, dal, oil, spices..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-[15px] outline-none font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-200 shrink-0"
              >✕</button>
            )}
          </div>
        </div>

        {/* ── Category Tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold shrink-0 border-2 transition-all duration-200 ${
                category === cat
                  ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-100'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* ── Section Header ── */}
        {!search && (
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {category === 'All' ? 'All Products' : category}
              </h2>
              {!loading && (
                <p className="text-sm text-gray-400 mt-0.5">{filtered.length} items available</p>
              )}
            </div>
          </div>
        )}

        {search && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-600">
              Search results for <span className="text-orange-500">"{search}"</span>
              {!loading && <span className="text-gray-400"> · {filtered.length} found</span>}
            </p>
          </div>
        )}

        {/* ── Products Grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-16">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 px-4">
            <div className="text-7xl mb-4">🛍️</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-400">Try a different category or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-16">
            {filtered.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}