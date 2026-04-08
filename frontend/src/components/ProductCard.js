
import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const API = "https://kirana-app-wph6.onrender.com/api";

export default function ProductCard({ product }) {
  const { cart, addToCart, updateQty, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const cartItem = cart.find(i => i._id === product._id);

 const imgSrc = `${API}/products/image/${product._id}`;

  const handleAdd = () => {
    if (!user) {
      toast('Please login to add items to cart!', { icon: '🔐' });
      navigate('/login');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const outOfStock = product.stock < 1;
  const lowStock = product.stock > 0 && product.stock < 10;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">

      {/* Image */}
      <div className="relative h-44 bg-gray-50 overflow-hidden shrink-0">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://placehold.co/300x200/FFF7ED/F97316?text=Product'; }}
        />

        {/* Category badge */}
        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-orange-600 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-orange-100">
          {product.category}
        </span>

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white text-gray-600 font-bold px-4 py-1.5 rounded-full text-sm shadow-md border border-gray-200">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-gray-900 text-[15px] leading-snug line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Unit + Stock */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full">
            {product.unit}
          </span>
          <span className={`text-xs font-semibold ${
            outOfStock ? 'text-red-500' : lowStock ? 'text-amber-600' : 'text-green-600'
          }`}>
            {outOfStock ? '❌ Out of stock' : lowStock ? `⚠️ Only ${product.stock} left` : '✅ In stock'}
          </span>
        </div>

        {/* Price + Button */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.price}
            </span>
          </div>

          {!cartItem ? (
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className={`font-bold text-sm px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 ${
                outOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {outOfStock ? 'Unavailable' : '+ Add'}
            </button>
          ) : (
            <div className="flex items-center bg-orange-50 border-2 border-orange-400 rounded-xl overflow-hidden">
              <button
                onClick={() => updateQty(product._id, cartItem.quantity - 1)}
                className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg flex items-center justify-center transition-colors"
              >−</button>
              <span className="w-8 text-center font-bold text-orange-600 text-sm select-none">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateQty(product._id, cartItem.quantity + 1)}
                className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg flex items-center justify-center transition-colors"
              >+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}