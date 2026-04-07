
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API = "https://kirana-app-s0v1.onrender.com/api";

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
      () => {
        setLocError('Could not get your location. Please allow location access.');
        setLocLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleOrder = async () => {
    if (!location) { toast.error('Please share your location first!'); return; }
    if (!address.trim()) { toast.error('Please enter your delivery address!'); return; }
    if (cartTotal < 100) { toast.error('Minimum order is ₹100'); return; }
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

  const canPlace = !placing && !!location && !!address.trim();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h2>
          <p className="text-gray-400 text-sm mt-1">Almost there! Confirm your delivery details below.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Left Column ── */}
          <div className="flex-1 space-y-4">

            {/* Step 1: Location */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-gray-900">Your Location</h3>
                  <p className="text-xs text-gray-400">Needed to verify 1 km delivery zone</p>
                </div>
              </div>

              {location ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-bold text-green-700 text-sm">Location captured!</p>
                    <p className="text-xs text-green-600 mt-0.5">
                      {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {locError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
                      <p className="text-red-600 text-sm font-medium">❌ {locError}</p>
                    </div>
                  )}
                  <button
                    onClick={getLocation}
                    disabled={locLoading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  >
                    {locLoading ? '⏳ Getting location...' : '📍 Share My Location'}
                  </button>
                </>
              )}
            </div>

            {/* Step 2: Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-gray-900">Delivery Address</h3>
                  <p className="text-xs text-gray-400">Where should we deliver?</p>
                </div>
              </div>
              <textarea
                rows={3}
                placeholder="Enter your full delivery address (house no, street, landmark)..."
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-400 rounded-xl text-sm resize-none bg-gray-50 focus:bg-white transition-all duration-200 outline-none"
              />
            </div>

            {/* Step 3: Order Note */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-gray-900">Order Note
                    <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Optional</span>
                  </h3>
                  <p className="text-xs text-gray-400">Any special instructions for delivery</p>
                </div>
              </div>
              <input
                type="text"
                placeholder="e.g. Please call before arriving, Leave at door..."
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-400 rounded-xl text-sm bg-gray-50 focus:bg-white transition-all duration-200 outline-none"
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">💵 Payment Method</h3>
              <div className="flex items-center gap-4 bg-green-50 border-2 border-green-500 rounded-xl p-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-green-100">
                  💵
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Cash on Delivery</p>
                  <p className="text-xs text-gray-500 mt-0.5">Pay when your order arrives at your door</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  ✓
                </div>
              </div>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="w-full lg:w-80 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
            <h3 className="text-xl font-bold text-gray-900 mb-5">Order Summary</h3>

            {/* Items list */}
            <div className="space-y-2.5 mb-4 max-h-48 overflow-y-auto">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between items-center text-sm gap-2">
                  <span className="text-gray-600 truncate leading-tight">
                    {item.name}
                    <span className="text-gray-400"> × {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-gray-900 shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Delivery</span>
                <span className="font-bold text-green-600">FREE</span>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-900 text-lg">Total</span>
              <span className="font-bold text-orange-500 text-2xl">₹{cartTotal}</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl text-center py-2.5 text-sm text-amber-700 font-semibold mt-5">
              ⏱️ Estimated: <strong>30–45 minutes</strong>
            </div>

            <button
              onClick={handleOrder}
              disabled={!canPlace}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-base"
            >
              {placing ? '⏳ Placing Order...' : `Place Order • ₹${cartTotal}`}
            </button>

            {!canPlace && !placing && (
              <p className="text-center text-xs text-gray-400 mt-2">
                {!location ? '📍 Share location to continue' : !address.trim() ? '🏠 Enter delivery address' : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}