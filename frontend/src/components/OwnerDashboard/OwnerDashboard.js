// components/OwnerDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaChartLine, FaStore, FaThumbsUp, FaTrophy, FaChartBar } from 'react-icons/fa';
import API_BASE_URL from "../../config/api";
import './OwnerDashboard.css';

function OwnerDashboard() {
  const [ratings, setRatings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRatings: 0,
    totalStores: 0,
    averageRating: 0,
    topRatedStore: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch ratings
        const ratingsRes = await axios.get(`${API_BASE_URL}/api/owner/ratings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRatings(ratingsRes.data);

        // Fetch average rating
        const avgRes = await axios.get(`${API_BASE_URL}/api/owner/average-rating`, {
          headers: { Authorization: `Bearer ${token}` },
        });


        // Calculate stats
        const totalRatings = ratingsRes.data.length;
        const uniqueStores = new Set(ratingsRes.data.map(rating => rating.store_id)).size;
        const avgRating = avgRes.data.average_rating || 0;
        
        // Find top rated store
        const storeRatings = {};
        ratingsRes.data.forEach(rating => {
          if (!storeRatings[rating.store_id]) {
            storeRatings[rating.store_id] = { total: 0, count: 0, name: rating.store_name };
          }
          storeRatings[rating.store_id].total += rating.rating;
          storeRatings[rating.store_id].count += 1;
        });

        let topStore = null;
        let topRating = 0;
        Object.values(storeRatings).forEach(store => {
          const avg = store.total / store.count;
          if (avg > topRating) {
            topRating = avg;
            topStore = { name: store.name, rating: avg };
          }
        });

        setStats({
          totalRatings,
          totalStores: uniqueStores,
          averageRating: avgRating,
          topRatedStore: topStore
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`star ${index < rating ? 'filled' : 'empty'}`}
      />
    ));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "#10b981";
    if (rating >= 3) return "#f59e0b";
    return "#ef4444";
  };

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4) return "Very Good";
    if (rating >= 3) return "Good";
    if (rating >= 2) return "Fair";
    return "Poor";
  };

  if (loading) {
    return (
      <div className="owner-dashboard-root">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-dashboard-root">
      <div className="owner-dashboard-container">
        <header className="owner-dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <FaStore className="store-icon" />
              <div className="welcome-text">
                <h2>Store Owner Dashboard</h2>
                <p>Monitor your store ratings and performance</p>
              </div>
            </div>
            <div className="header-stats">
              <div className="stat-card">
                <FaStar className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">{stats.averageRating.toFixed(1)}</span>
                  <span className="stat-label">Avg Rating</span>
                </div>
              </div>
              <div className="stat-card">
                <FaThumbsUp className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">{stats.totalRatings}</span>
                  <span className="stat-label">Total Ratings</span>
                </div>
              </div>
              <div className="stat-card">
                <FaStore className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">{stats.totalStores}</span>
                  <span className="stat-label">Stores</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="owner-dashboard-content">
          <section className="overview-section">
            <div className="overview-grid">
              <div className="overview-card main-card">
                <div className="card-header">
                  <FaChartLine className="card-icon" />
                  <h3>Overall Performance</h3>
                </div>
                <div className="performance-metrics">
                  <div className="metric-item">
                    <div className="metric-value" style={{ color: getRatingColor(stats.averageRating) }}>
                      {stats.averageRating.toFixed(1)}
                    </div>
                    <div className="metric-label">Average Rating</div>
                    <div className="metric-stars">
                      {renderStars(Math.round(stats.averageRating))}
                    </div>
                    <div className="metric-status">
                      {getRatingLabel(stats.averageRating)}
                    </div>
                  </div>
                </div>
              </div>

              {stats.topRatedStore && (
                <div className="overview-card">
                  <div className="card-header">
                    <FaTrophy className="card-icon" />
                    <h3>Top Performing Store</h3>
                  </div>
                  <div className="top-store-info">
                    <h4>{stats.topRatedStore.name}</h4>
                    <div className="store-rating">
                      <span className="rating-value">{stats.topRatedStore.rating.toFixed(1)}</span>
                      <div className="rating-stars">
                        {renderStars(Math.round(stats.topRatedStore.rating))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

                              <div className="overview-card">
                  <div className="card-header">
                    <FaChartBar className="card-icon" />
                    <h3>Activity Summary</h3>
                  </div>
                <div className="activity-summary">
                  <div className="activity-item">
                    <span className="activity-number">{stats.totalRatings}</span>
                    <span className="activity-label">Total Reviews</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-number">{stats.totalStores}</span>
                    <span className="activity-label">Active Stores</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="ratings-section">
            <div className="section-header">
              <h3>Recent Ratings</h3>
              <div className="section-actions">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">This Week</button>
                <button className="filter-btn">This Month</button>
              </div>
            </div>

            {ratings.length === 0 ? (
              <div className="empty-state">
                <FaStar className="empty-icon" />
                <h3>No ratings yet</h3>
                <p>Ratings from customers will appear here</p>
              </div>
            ) : (
              <div className="ratings-grid">
                {ratings.slice(0, 6).map((rating) => (
                  <div key={rating.id} className="rating-card">
                    <div className="rating-header">
                      <div className="store-info">
                        <h4>{rating.store_name}</h4>
                        <span className="rating-date">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="rating-badge" style={{ backgroundColor: getRatingColor(rating.rating) }}>
                        <FaStar className="rating-star" />
                        <span>{rating.rating}</span>
                      </div>
                    </div>
                    
                    <div className="rating-stars">
                      {renderStars(rating.rating)}
                    </div>
                    
                    {rating.review && (
                      <div className="rating-review">
                        <p>"{rating.review}"</p>
                      </div>
                    )}
                    
                    <div className="rating-footer">
                      <span className="customer-info">Customer Review</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;
