import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import UsersPage from './pages/UsersPage';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/login" />;
  return children;
};

const AdminLayout = ({ children }) => (
  <div className="flex bg-gray-50 min-h-screen">
    <Sidebar />
    <main className="flex-1 ml-[272px] mt-4 mr-4 mb-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      {children}
    </main>
  </div>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />

    <Route path="/" element={
      <ProtectedRoute><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>
    } />
    <Route path="/products" element={
      <ProtectedRoute><AdminLayout><ProductsPage /></AdminLayout></ProtectedRoute>
    } />
    <Route path="/orders" element={
      <ProtectedRoute><AdminLayout><OrdersPage /></AdminLayout></ProtectedRoute>
    } />
    <Route path="/users" element={
      <ProtectedRoute><AdminLayout><UsersPage /></AdminLayout></ProtectedRoute>
    } />

    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}