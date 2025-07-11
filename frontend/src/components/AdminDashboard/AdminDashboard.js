// components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStore, FaUsers, FaChartBar, FaPlus, FaEdit, FaTrash, FaStar, FaEye, FaCrown, FaTrophy, FaChartLine } from 'react-icons/fa';
import api from "../../config/api";
import './AdminDashboard.css';

function AdminDashboard() {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [newStore, setNewStore] = useState({ name: '', address: '', store_owner_email: '' });
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch stores
        const storesRes = await axios.get(api.adminStores, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(storesRes.data);

        // Fetch users
        const usersRes = await axios.get(api.adminUsers, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersRes.data);

        // Fetch owners for store assignment
        const ownersRes = await axios.get(api.adminOwners, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOwners(ownersRes.data);

        // Fetch summary
        const summaryRes = await axios.get(api.adminSummary, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(summaryRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(api.addUser, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowAddUser(false);
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      // Refresh users list
      const usersRes = await axios.get(api.adminUsers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(api.addStore, newStore, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowAddStore(false);
      setNewStore({ name: '', address: '', store_owner_email: '' });
      // Refresh stores list
      const storesRes = await axios.get(api.adminStores, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(storesRes.data);
    } catch (err) {
      console.error("Error adding store:", err);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'owner': return '#f59e0b';
      case 'user': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "#10b981";
    if (rating >= 3) return "#f59e0b";
    return "#ef4444";
  };

  if (loading) {
    return (
      <div className="admin-dashboard-root">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-root">
      <div className="admin-dashboard-container">
        <header className="admin-dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <FaCrown className="admin-icon" />
              <div className="welcome-text">
                <h2>Admin Dashboard</h2>
                <p>Manage users, stores, and system overview</p>
              </div>
            </div>
            <div className="header-stats">
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">{summary.totalUsers || 0}</span>
                  <span className="stat-label">Total Users</span>
                </div>
              </div>
              <div className="stat-card">
                <FaStore className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">{summary.totalStores || 0}</span>
                  <span className="stat-label">Total Stores</span>
                </div>
              </div>
              <div className="stat-card">
                <FaStar className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">{summary.totalRatings || 0}</span>
                  <span className="stat-label">Total Ratings</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-dashboard-content">
          <nav className="dashboard-nav">
            <button 
              className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FaChartBar className="nav-icon" />
              Overview
            </button>
            <button 
              className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <FaUsers className="nav-icon" />
              Users
            </button>
            <button 
              className={`nav-btn ${activeTab === 'stores' ? 'active' : ''}`}
              onClick={() => setActiveTab('stores')}
            >
              <FaStore className="nav-icon" />
              Stores
            </button>
          </nav>

          {activeTab === 'overview' && (
            <section className="overview-section">
              <div className="overview-grid">
                <div className="overview-card main-card">
                  <div className="card-header">
                    <FaChartLine className="card-icon" />
                    <h3>System Overview</h3>
                  </div>
                  <div className="overview-metrics">
                    <div className="metric-row">
                      <div className="metric-item">
                        <span className="metric-label">Total Users</span>
                        <span className="metric-value">{summary.totalUsers || 0}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Total Stores</span>
                        <span className="metric-value">{summary.totalStores || 0}</span>
                      </div>
                    </div>
                    <div className="metric-row">
                      <div className="metric-item">
                        <span className="metric-label">Total Ratings</span>
                        <span className="metric-value">{summary.totalRatings || 0}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Avg Rating</span>
                        <span className="metric-value">{summary.averageRating ? summary.averageRating.toFixed(1) : '0.0'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overview-card">
                  <div className="card-header">
                    <FaTrophy className="card-icon" />
                    <h3>Top Rated Store</h3>
                  </div>
                  <div className="top-store-info">
                    {summary.topStore ? (
                      <>
                        <h4>{summary.topStore.name}</h4>
                        <div className="store-rating">
                          <span className="rating-value">{summary.topStore.average_rating.toFixed(1)}</span>
                          <div className="rating-stars">
                            {Array.from({ length: 5 }, (_, i) => (
                              <FaStar key={i} className={`star ${i < Math.round(summary.topStore.average_rating) ? 'filled' : 'empty'}`} />
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p>No stores rated yet</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'users' && (
            <section className="users-section">
              <div className="section-header">
                <h3>User Management</h3>
                <button 
                  className="add-btn"
                  onClick={() => setShowAddUser(true)}
                >
                  <FaPlus className="btn-icon" />
                  Add User
                </button>
              </div>

              <div className="users-grid">
                {users.map((user) => (
                  <div key={user.id} className="user-card">
                    <div className="user-header">
                      <div className="user-info">
                        <h4>{user.name}</h4>
                        <span className="user-email">{user.email}</span>
                      </div>
                      <div className="user-role" style={{ backgroundColor: getRoleColor(user.role) }}>
                        {user.role}
                      </div>
                    </div>
                    <div className="user-actions">
                      <button className="action-btn view">
                        <FaEye className="action-icon" />
                      </button>
                      <button className="action-btn edit">
                        <FaEdit className="action-icon" />
                      </button>
                      <button className="action-btn delete">
                        <FaTrash className="action-icon" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {showAddUser && (
                <div className="modal-overlay">
                  <div className="modal">
                    <div className="modal-header">
                      <h3>Add New User</h3>
                      <button onClick={() => setShowAddUser(false)} className="close-btn">×</button>
                    </div>
                    <form onSubmit={handleAddUser} className="modal-form">
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Password</label>
                        <input
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Role</label>
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        >
                          <option value="user">User</option>
                          <option value="owner">Owner</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div className="modal-actions">
                        <button type="button" onClick={() => setShowAddUser(false)} className="cancel-btn">
                          Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                          Add User
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}

          {activeTab === 'stores' && (
            <section className="stores-section">
              <div className="section-header">
                <h3>Store Management</h3>
                <button 
                  className="add-btn"
                  onClick={() => setShowAddStore(true)}
                >
                  <FaPlus className="btn-icon" />
                  Add Store
                </button>
              </div>

              <div className="stores-grid">
                {stores.map((store) => (
                  <div key={store.id} className="store-card">
                    <div className="store-header">
                      <div className="store-info">
                        <h4>{store.name}</h4>
                        <span className="store-address">{store.address}</span>
                      </div>
                      {store.average_rating && (
                        <div className="store-rating" style={{ backgroundColor: getRatingColor(store.average_rating) }}>
                          <FaStar className="rating-star" />
                          <span>{store.average_rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="store-actions">
                      <button className="action-btn view">
                        <FaEye className="action-icon" />
                      </button>
                      <button className="action-btn edit">
                        <FaEdit className="action-icon" />
                      </button>
                      <button className="action-btn delete">
                        <FaTrash className="action-icon" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {showAddStore && (
                <div className="modal-overlay">
                  <div className="modal">
                    <div className="modal-header">
                      <h3>Add New Store</h3>
                      <button onClick={() => setShowAddStore(false)} className="close-btn">×</button>
                    </div>
                    <form onSubmit={handleAddStore} className="modal-form">
                      <div className="form-group">
                        <label>Store Name</label>
                        <input
                          type="text"
                          value={newStore.name}
                          onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <input
                          type="text"
                          value={newStore.address}
                          onChange={(e) => setNewStore({...newStore, address: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Store Owner</label>
                        <select
                          value={newStore.store_owner_email}
                          onChange={(e) => setNewStore({...newStore, store_owner_email: e.target.value})}
                          required
                        >
                          <option value="">Select Owner</option>
                          {owners.map((owner) => (
                            <option key={owner.email} value={owner.email}>
                              {owner.name} ({owner.email})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="modal-actions">
                        <button type="button" onClick={() => setShowAddStore(false)} className="cancel-btn">
                          Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                          Add Store
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
