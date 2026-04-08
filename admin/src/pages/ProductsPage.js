import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './ProductsPage.css';

const API = "https://kirana-app-wph6.onrender.com/api";
const BASE = API.replace('/api', '');

const CATEGORIES = ['Atta & Rice', 'Dal & Pulses', 'Oil & Ghee', 'Spices', 'Snacks', 'Dairy', 'Beverages', 'Soap & Cleaning', 'Other'];

const EMPTY_FORM = { name: '', description: '', price: '', category: 'Atta & Rice', stock: '', unit: 'piece', isAvailable: true };

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/products?category=All`);
      // Admin needs all products including unavailable
      const { data: all } = await axios.get(`${API}/products`);
      setProducts(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description, price: p.price,
      category: p.category, stock: p.stock, unit: p.unit, isAvailable: p.isAvailable
    });
    setEditId(p._id);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      toast.success('Product deleted!');
      fetchProducts();
    } catch (err) { toast.error('Delete failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editId) {
        await axios.put(`${API}/products/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated!');
      } else {
        await axios.post(`${API}/products`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product added!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1>📦 Products</h1>
          <p>{products.length} total products</p>
        </div>
        <button className="btn-add-product" onClick={openAdd}>+ Add Product</button>
      </div>

      <div className="products-toolbar">
        <input
          className="search-input"
          placeholder="🔍 Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : (
        <div className="products-table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
              const imgSrc = `${API}/products/image/${p._id}`;
                return (
                  <tr key={p._id}>
                    <td>
                      
                      <img src={imgSrc} alt={p.name}
                        onError={e => { e.target.src = 'https://via.placeholder.com/48?text=P'; }} />
                    </td>
                    <td>
                      <strong>{p.name}</strong>
                      <p className="prod-desc">{p.description?.slice(0, 40)}...</p>
                    </td>
                    <td><span className="cat-tag">{p.category}</span></td>
                    <td><strong className="price-text">₹{p.price}</strong></td>
                    <td>
                      <span className={`stock-text ${p.stock < 10 ? 'low' : ''}`}>
                        {p.stock} {p.unit}s
                      </span>
                    </td>
                    <td>
                      <span className={`avail-badge ${p.isAvailable ? 'yes' : 'no'}`}>
                        {p.isAvailable ? '✅ Active' : '❌ Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => openEdit(p)}>✏️ Edit</button>
                        <button className="btn-del" onClick={() => handleDelete(p._id, p.name)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="no-products">No products found.</p>}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Aashirvaad Atta 5kg" />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short product description..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required placeholder="0" />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required placeholder="0" />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <input type="text" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="kg / piece / bag" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Image</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                </div>
                <div className="form-group form-check">
                  <label>
                    <input type="checkbox" checked={form.isAvailable}
                      onChange={e => setForm({ ...form, isAvailable: e.target.checked })} />
                    {' '} Show to customers (Available)
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}