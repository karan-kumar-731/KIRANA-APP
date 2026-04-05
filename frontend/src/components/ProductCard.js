import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function ProductCard({ product }) {
  const { cart, addToCart, updateQty, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const cartItem = cart.find(i => i._id === product._id);

  const imgSrc = product.image?.startsWith('http')
    ? product.image
    : `${API}${product.image}`;

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

  return (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden group">

      {/* Image */}
      <div className="relative h-44 bg-gray-50 overflow-hidden shrink-0">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = 'https://placehold.co/300x200/FFF3E8/FF6B00?text=Product'; }}
        />
        {/* Category badge */}
        <span className="absolute top-2 left-2 bg-saffron text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
          {product.category}
        </span>
        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-700 font-bold px-3 py-1.5 rounded-full text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-display font-bold text-gray-900 text-[15px] leading-tight line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Unit + Stock */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-semibold text-kgreen bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full">
            {product.unit}
          </span>
          <span className={`text-xs font-semibold ${product.stock < 10 && product.stock > 0 ? 'text-amber-600' : product.stock < 1 ? 'text-red-500' : 'text-kgreen'}`}>
            {product.stock < 1 ? '❌ Out of stock' : product.stock < 10 ? `⚠️ Only ${product.stock} left` : '✅ In stock'}
          </span>
        </div>

        {/* Price + Button */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span className="font-display font-extrabold text-2xl text-saffron">
            ₹{product.price}
          </span>

          {!cartItem ? (
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className={`font-bold text-sm px-4 py-2 rounded-xl transition-all active:scale-95 ${
                outOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-saffron hover:bg-saffron-light text-white shadow-sm hover:shadow-md'
              }`}
            >
              {outOfStock ? 'Out of Stock' : '+ Add'}
            </button>
          ) : (
            <div className="flex items-center border-2 border-saffron rounded-xl overflow-hidden">
              <button
                onClick={() => updateQty(product._id, cartItem.quantity - 1)}
                className="w-8 h-8 bg-saffron hover:bg-saffron-light text-white font-bold text-lg flex items-center justify-center transition-colors"
              >−</button>
              <span className="w-8 text-center font-bold text-saffron text-sm select-none">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateQty(product._id, cartItem.quantity + 1)}
                className="w-8 h-8 bg-saffron hover:bg-saffron-light text-white font-bold text-lg flex items-center justify-center transition-colors"
              >+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}