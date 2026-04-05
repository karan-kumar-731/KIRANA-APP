import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [note, setNote] = useState('');
  const [location, setLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (cart.length === 0) navigate('/cart');
  }, [cart]);

  const getLocation = () => {
    setLocLoading(true);
    setLocError('');
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported by your browser.');
      setLocLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocLoading(false);
        toast.success('Location detected! ✅');
      },
      (err) => {
        setLocError('Could not get your location. Please allow location access.');
        setLocLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleOrder = async () => {
    if (!location) {
      toast.error('Please share your location first!');
      return;
    }
    if (!address.trim()) {
      toast.error('Please enter your delivery address!');
      return;
    }
    if (cartTotal < 100) {
      toast.error('Minimum order is ₹100');
      return;
    }

    setPlacing(true);
    try {
      const items = cart.map(i => ({ productId: i._id, name: i.name, quantity: i.quantity }));
      await axios.post(`${API}/orders`, { items, deliveryAddress: address, userLocation: location, note });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="font-display text-3xl font-extrabold text-gray-900 mb-8">📦 Checkout</h2>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Left Column ── */}
          <div className="flex-1 space-y-4">

            {/* Location */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-display text-lg font-bold text-gray-900 mb-1">📍 Your Location</h3>
              <p className="text-sm text-gray-500 mb-4">
                We need your location to check if you're within our 1 km delivery zone.
              </p>
              {location ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 text-green-700 font-bold text-sm">
                  ✅ Location captured! (Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)})
                </div>
              ) : (
                <>
                  {locError && (
                    <p className="text-red-500 text-sm mb-3 font-medium">❌ {locError}</p>
                  )}
                  <button
                    onClick={getLocation}
                    disabled={locLoading}
                    className="w-full bg-saffron hover:bg-saffron-light disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-sm"
                  >
                    {locLoading ? '⏳ Getting location...' : '📍 Share My Location'}
                  </button>
                </>
              )}
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-display text-lg font-bold text-gray-900 mb-3">🏠 Delivery Address</h3>
              <textarea
                rows={3}
                placeholder="Enter your full delivery address..."
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-saffron rounded-xl text-sm resize-none bg-gray-50 focus:bg-white transition-colors"
              />
            </div>

            {/* Note */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-display text-lg font-bold text-gray-900 mb-3">
                📝 Order Note{' '}
                <span className="font-normal text-gray-400 text-sm">(optional)</span>
              </h3>
              <input
                type="text"
                placeholder="Any special instructions..."
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-saffron rounded-xl text-sm bg-gray-50 focus:bg-white transition-colors"
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-display text-lg font-bold text-gray-900 mb-3">💵 Payment Method</h3>
              <div className="flex items-center gap-4 bg-green-50 border-2 border-kgreen rounded-xl p-4">
                <span className="text-3xl">💵</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Cash on Delivery</p>
                  <p className="text-xs text-gray-500 mt-0.5">Pay when your order arrives</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-kgreen flex items-center justify-center text-white text-sm font-bold shrink-0">
                  ✓
                </div>
              </div>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="w-full lg:w-80 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
            <h3 className="font-display text-xl font-extrabold text-gray-900 mb-5">Order Summary</h3>

            {/* Items list */}
            <div className="space-y-2 mb-4">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate pr-2">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-bold text-kgreen">FREE</span>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
              <span className="font-display font-bold text-gray-900 text-lg">Total</span>
              <span className="font-display font-extrabold text-saffron text-2xl">₹{cartTotal}</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl text-center py-2.5 text-sm text-amber-700 font-semibold mt-4">
              ⏱️ Estimated delivery: <strong>30-45 minutes</strong>
            </div>

            <button
              onClick={handleOrder}
              disabled={placing || !location || !address.trim()}
              className="w-full mt-4 bg-kgreen hover:bg-kgreen-light disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-base"
            >
              {placing ? '⏳ Placing Order...' : `Place Order • ₹${cartTotal}`}
            </button>

            {(!location || !address.trim()) && (
              <p className="text-center text-xs text-gray-400 mt-2">
                {!location ? '📍 Share location first' : '🏠 Enter delivery address'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}