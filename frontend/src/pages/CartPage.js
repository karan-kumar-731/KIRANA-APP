import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const API = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function CartPage() {
  const { cart, updateQty, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 bg-gray-50">
        <span className="text-8xl">🛒</span>
        <h2 className="font-display text-3xl font-bold text-gray-800">Your cart is empty!</h2>
        <p className="text-gray-500">Add some items from the shop</p>
        <Link
          to="/"
          className="bg-saffron hover:bg-saffron-light text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md hover:-translate-y-0.5"
        >
          Browse Products →
        </Link>
      </div>
    );
  }

  const remaining = Math.max(0, 100 - cartTotal);
  const progress = Math.min(100, (cartTotal / 100) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl font-extrabold text-gray-900">
            🛒 Your Cart{' '}
            <span className="text-gray-400 font-semibold text-xl">({cart.length} items)</span>
          </h2>
          <button
            onClick={clearCart}
            className="text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
          >
            🗑️ Clear All
          </button>
        </div>

        {/* Min order progress banner */}
        {remaining > 0 && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6">
            <p className="text-amber-800 font-bold text-sm mb-2">
              ⚠️ Add ₹{remaining} more to reach the minimum order of ₹100
            </p>
            <div className="w-full bg-amber-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Cart Items */}
          <div className="flex-1 flex flex-col gap-3">
            {cart.map(item => {
              const imgSrc = item.image?.startsWith('http') ? item.image : `${API}${item.image}`;
              return (
                <div key={item._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <img
                    src={imgSrc}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover bg-gray-50 shrink-0"
                    onError={e => { e.target.src = 'https://placehold.co/80?text=Item'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-gray-900 text-[15px] leading-tight truncate">{item.name}</h4>
                    <p className="text-xs font-semibold text-kgreen mt-0.5">{item.unit}</p>
                    <p className="text-sm text-gray-500 mt-0.5">₹{item.price} each</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {/* Qty control */}
                    <div className="flex items-center border-2 border-saffron rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQty(item._id, item.quantity - 1)}
                        className="w-8 h-8 bg-saffron hover:bg-saffron-light text-white font-bold text-lg flex items-center justify-center transition-colors"
                      >−</button>
                      <span className="w-8 text-center font-bold text-saffron text-sm select-none">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item._id, item.quantity + 1)}
                        className="w-8 h-8 bg-saffron hover:bg-saffron-light text-white font-bold text-lg flex items-center justify-center transition-colors"
                      >+</button>
                    </div>
                    <p className="font-display font-extrabold text-saffron text-lg">₹{item.price * item.quantity}</p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-300 hover:text-red-400 text-lg transition-colors"
                    >🗑️</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
            <h3 className="font-display text-xl font-extrabold text-gray-900 mb-5">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-bold text-kgreen">FREE</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Minimum Order</span>
                <span>₹100</span>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
              <span className="font-display font-bold text-gray-900 text-lg">Total</span>
              <span className="font-display font-extrabold text-saffron text-2xl">₹{cartTotal}</span>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl text-center py-2.5 text-sm font-bold text-kgreen mt-4">
              💵 Cash on Delivery
            </div>

            <button
              disabled={cartTotal < 100}
              onClick={() => navigate('/checkout')}
              className="w-full mt-4 bg-saffron hover:bg-saffron-light disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:shadow-none disabled:translate-y-0"
            >
              {cartTotal < 100 ? `Add ₹${remaining} more` : 'Proceed to Checkout →'}
            </button>

            <Link to="/" className="block text-center text-saffron font-semibold text-sm mt-3 hover:underline">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}