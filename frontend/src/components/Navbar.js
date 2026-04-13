

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useCart } from '../context/CartContext';

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const { cartCount } = useCart();
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener('scroll', onScroll);
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//     setMenuOpen(false);
//   };

//   return (
//     <nav
//       className={`sticky top-0 z-50 transition-all duration-300 ${
//         scrolled
//           ? 'bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-100'
//           : 'bg-white border-b border-gray-100'
//       }`}
//     >
//       <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

//         {/* Brand */}
//         <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
//           <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
//             <span className="text-lg">🛒</span>
//           </div>
//           <span className="font-bold text-xl tracking-tight">
            
//             <span className="text-orange-500">Kirana</span>
//             <span className="text-green-600">Shop</span>
//           </span>
//         </Link>

//         {/* Desktop Links */}
//         <div className="hidden md:flex items-center gap-1">
//           <Link
//             to="/"
//             className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
//           >
//             Home
//           </Link>
//           {user && (
//             <Link
//               to="/orders"
//               className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
//             >
//               My Orders
//             </Link>
//           )}
//         </div>

//         {/* Right Side */}
//         <div className="flex items-center gap-2">
//           {/* Auth — Desktop */}
//           <div className="hidden md:flex items-center gap-2">
//             {user ? (
//               <>
//                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 border border-green-100">
//                   <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
//                     {user.name.charAt(0).toUpperCase()}
//                   </div>
//                   <span className="text-sm font-semibold text-green-700">{user.name.split(' ')[0]}</span>
//                 </div>
//                 <button
//                   onClick={handleLogout}
//                   className="px-4 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-200"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Cart Button */}
//           <Link
//             to="/cart"
//             className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-100 transition-all duration-200 hover:-translate-y-0.5"
//           >
//             <span className="text-lg">🛒</span>
//             {cartCount > 0 && (
//               <>
//                 <span className="hidden sm:block text-sm font-bold text-orange-600">Cart</span>
//                 <span className="bg-orange-500 text-white text-xs font-extrabold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1">
//                   {cartCount}
//                 </span>
//               </>
//             )}
//           </Link>

//           {/* Hamburger */}
//           <button
//             className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200"
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label="Toggle menu"
//           >
//             <div className="flex flex-col gap-1.5 w-5">
//               <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
//               <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
//               <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div
//         className={`md:hidden overflow-hidden transition-all duration-300 ${
//           menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//         }`}
//       >
//         <div className="bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1">
//           <Link
//             to="/"
//             onClick={() => setMenuOpen(false)}
//             className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
//           >
//             <span>🏠</span> Home
//           </Link>
//           {user && (
//             <Link
//               to="/orders"
//               onClick={() => setMenuOpen(false)}
//               className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
//             >
//               <span>📦</span> My Orders
//             </Link>
//           )}
//           <div className="border-t border-gray-100 pt-3 mt-1 flex flex-col gap-1">
//             {user ? (
//               <>
//                 <div className="flex items-center gap-3 px-4 py-2">
//                   <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">
//                     {user.name.charAt(0).toUpperCase()}
//                   </div>
//                   <span className="font-semibold text-gray-900">{user.name}</span>
//                 </div>
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 font-semibold hover:bg-red-50 transition-colors text-left"
//                 >
//                   <span>🚪</span> Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   onClick={() => setMenuOpen(false)}
//                   className="px-4 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-center"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   onClick={() => setMenuOpen(false)}
//                   className="px-4 py-3 rounded-xl text-white font-bold bg-orange-500 hover:bg-orange-600 transition-colors text-center"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'} border-b border-gray-100`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between gap-4">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:bg-blue-700 transition-colors duration-150">
            K
          </div>
          <span className="font-semibold text-base tracking-tight text-gray-900">
            Kirana<span className="text-blue-600">Shop</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-0.5">
          <Link to="/" className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-150">
            Home
          </Link>
          {user && (
            <Link to="/orders" className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-150">
              My Orders
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Auth — Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all duration-150">
                  Login
                </Link>
                <Link to="/register" className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-150 shadow-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Cart Button */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-150"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <>
                <span className="hidden sm:block text-sm font-medium text-gray-700">Cart</span>
                <span className="bg-blue-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              </>
            )}
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-all duration-150"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1 w-4">
              <span className={`block h-px bg-current rounded-full transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
              <span className={`block h-px bg-current rounded-full transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px bg-current rounded-full transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-200 ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-0.5">
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Home
          </Link>
          {user && (
            <Link to="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              My Orders
            </Link>
          )}
          <div className="border-t border-gray-100 pt-2 mt-1 flex flex-col gap-0.5">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors text-center">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}