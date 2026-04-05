import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UsersPage.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${API}/admin/users`)
      .then(r => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1>👥 Customers</h1>
          <p>{users.length} registered customers</p>
        </div>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="🔍 Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="loading-text">Loading users...</p>
      ) : (
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u._id}>
                  <td className="user-num">{i + 1}</td>
                  <td>
                    <div className="user-name-cell">
                      <div className="user-avatar">{u.name[0].toUpperCase()}</div>
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td><span className="phone-text">📱 {u.phone}</span></td>
                  <td className="addr-text">{u.address || '—'}</td>
                  <td className="date-text">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <span className={`status-pill ${u.isActive ? 'active' : 'inactive'}`}>
                      {u.isActive ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="no-data">No customers found.</p>}
        </div>
      )}
    </div>
  );
}