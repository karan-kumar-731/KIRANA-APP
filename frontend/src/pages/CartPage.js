
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const API = "import.meta.env.VITE_API_URL";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 bg-gray-50">
        <div className="w-32 h-32 bg-orange-50 rounded-3xl flex items-center justify-center border-2 border-orange-100">
          <span className="text-6xl">🛒</span>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Your cart is empty!</h2>
          <p className="text-gray-500 text-sm">Add some items from the shop to get started</p>
        </div>
        <Link
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
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
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Your Cart
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all duration-200"
          >
            🗑️ Clear All
          </button>
        </div>

        {/* Min order progress banner */}
        {remaining > 0 && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-amber-800 font-bold text-sm">
                ⚠️ Add ₹{remaining} more for minimum order
              </p>
              <span className="text-amber-700 font-bold text-sm">₹{cartTotal} / ₹100</span>
            </div>
            <div className="w-full bg-amber-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {remaining === 0 && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <p className="text-green-800 font-bold text-sm">You've reached the minimum order amount!</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Cart Items */}
          <div className="flex-1 flex flex-col gap-3">
            {cart.map(item => {
              const imgSrc = item.image?.startsWith('http') ? item.image : `${API}${item.image}`;
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                    <img
                      src={imgSrc}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = 'https://placehold.co/80?text=Item'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-[15px] leading-tight truncate">{item.name}</h4>
                    <p className="text-xs font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full inline-block mt-1">{item.unit}</p>
                    <p className="text-sm text-gray-400 mt-1">₹{item.price} each</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {/* Qty control */}
                    <div className="flex items-center bg-orange-50 border-2 border-orange-400 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQty(item._id, item.quantity - 1)}
                        className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg flex items-center justify-center transition-colors"
                      >−</button>
                      <span className="w-8 text-center font-bold text-orange-600 text-sm select-none">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item._id, item.quantity + 1)}
                        className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg flex items-center justify-center transition-colors"
                      >+</button>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">₹{item.price * item.quantity}</p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-lg"
                      aria-label="Remove item"
                    >🗑️</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
            <h3 className="text-xl font-bold text-gray-900 mb-5">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Subtotal ({cart.length} items)</span>
                <span className="font-semibold text-gray-900">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-bold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400 pb-1">
                <span>Minimum Order</span>
                <span>₹100</span>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-900 text-lg">Total</span>
              <span className="font-bold text-orange-500 text-2xl">₹{cartTotal}</span>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl text-center py-2.5 text-sm font-semibold text-green-700 mt-5 flex items-center justify-center gap-1.5">
              <span>💵</span> Cash on Delivery
            </div>

            <button
              disabled={cartTotal < 100}
              onClick={() => navigate('/checkout')}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:shadow-none disabled:translate-y-0"
            >
              {cartTotal < 100 ? `Add ₹${remaining} more to checkout` : 'Proceed to Checkout →'}
            </button>

            <Link to="/" className="block text-center text-orange-500 font-semibold text-sm mt-4 hover:underline">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}