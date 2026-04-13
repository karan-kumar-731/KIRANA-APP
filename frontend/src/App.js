// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { CartProvider } from './context/CartContext';
// import Navbar from './components/Navbar';
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import CartPage from './pages/CartPage';
// import OrdersPage from './pages/OrdersPage';
// import CheckoutPage from './pages/CheckoutPage';

// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/login" />;
// };

// const AppRoutes = () => (
//   <>
//     <Navbar />
//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />
//       <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
//       <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
//       <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
//     </Routes>
//   </>
// );

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <CartProvider>
//           <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'Hind, sans-serif' } }} />
//           <AppRoutes />
//         </CartProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import CheckoutPage from './pages/CheckoutPage';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
    </Routes>
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'Inter, sans-serif', fontSize: '14px', borderRadius: '10px' } }} />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}