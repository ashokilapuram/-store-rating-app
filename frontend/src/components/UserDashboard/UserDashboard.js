import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaMapMarkerAlt, FaUser, FaThumbsUp, FaComment, FaSearch, FaStore } from 'react-icons/fa';
import API_BASE_URL from "../../config/api";
import './UserDashboard.css';

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/user/stores`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stores:", err);
        setLoading(false);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(res.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    fetchStores();
    fetchUserInfo();
  }, []);

  const handleRatingChange = (storeId, rating) => {
    setSelectedRatings({ ...selectedRatings, [storeId]: rating });
  };

  const handleFeedbackChange = (storeId, text) => {
    setFeedback({ ...feedback, [storeId]: text });
  };

  const submitRating = async (storeId) => {
    const rating = selectedRatings[storeId];
    const review = feedback[storeId] || "";

    if (!rating) {
      alert("Please select a rating.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/user/rate`,
        { store_id: storeId, rating, review },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Clear the form after successful submission
      setSelectedRatings({ ...selectedRatings, [storeId]: "" });
      setFeedback({ ...feedback, [storeId]: "" });
      
      // Update the store's average rating locally
      setStores(prevStores => 
        prevStores.map(store => 
          store.id === storeId 
            ? { ...store, average_rating: ((store.average_rating || 0) + parseInt(rating)) / 2 }
            : store
        )
      );

      alert("Rating submitted successfully!");
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert("Failed to submit rating.");
    }
  };

  // Star rendering function for future use
  // const renderStars = (rating) => {
  //   return Array.from({ length: 5 }, (_, index) => (
  //     <FaStar
  //       key={index}
  //       className={`star ${index < rating ? 'filled' : 'empty'}`}
  //     />
  //   ));
  // };

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === "all" || 
                         (filterRating === "rated" && store.average_rating) ||
                         (filterRating === "unrated" && !store.average_rating);
    return matchesSearch && matchesRating;
  });

  const getRatingColor = (rating) => {
    if (rating >= 4) return "#10b981";
    if (rating >= 3) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="user-dashboard-root">
      <div className="user-dashboard-container">
        <header className="user-dashboard-header">
          <div className="header-content">
            <div className="user-welcome">
              <FaUser className="user-icon" />
              <div className="welcome-text">
                <h2>Welcome back, {userInfo.name || 'User'}!</h2>
                <p>Rate and review your favorite stores</p>
              </div>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-number">{stores.length}</span>
                <span className="stat-label">Stores</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {stores.filter(store => store.average_rating).length}
                </span>
                <span className="stat-label">Rated</span>
              </div>
            </div>
          </div>
        </header>

        <div className="user-dashboard-content">
          <section className="search-filters-section">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search stores by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-container">
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Stores</option>
                <option value="rated">Rated Stores</option>
                <option value="unrated">Unrated Stores</option>
              </select>
            </div>
          </section>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading stores...</p>
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="empty-state">
              <FaStore className="empty-icon" />
              <h3>No stores found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="stores-grid">
              {filteredStores.map((store) => (
                <div key={store.id} className="store-card">
                  <div className="store-header">
                    <div className="store-info">
                      <h3 className="store-name">{store.name}</h3>
                      <div className="store-location">
                        <FaMapMarkerAlt className="location-icon" />
                        <span>{store.address}</span>
                      </div>
                    </div>
                    <div className="store-rating-display">
                      {store.average_rating ? (
                        <div className="rating-badge" style={{ backgroundColor: getRatingColor(store.average_rating) }}>
                          <FaStar className="rating-star" />
                          <span>{store.average_rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <div className="no-rating-badge">
                          <span>No ratings yet</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="store-content">
                    <div className="rating-section">
                      <h4>Rate this store</h4>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            className={`star-btn ${selectedRatings[store.id] >= rating ? 'selected' : ''}`}
                            onClick={() => handleRatingChange(store.id, rating)}
                          >
                            <FaStar />
                          </button>
                        ))}
                      </div>
                      <span className="rating-text">
                        {selectedRatings[store.id] ? `${selectedRatings[store.id]} star${selectedRatings[store.id] > 1 ? 's' : ''}` : 'Select rating'}
                      </span>
                    </div>

                    <div className="feedback-section">
                      <div className="feedback-header">
                        <FaComment className="feedback-icon" />
                        <h4>Write a review (optional)</h4>
                      </div>
                      <textarea
                        placeholder="Share your experience with this store..."
                        className="feedback-input"
                        value={feedback[store.id] || ""}
                        onChange={(e) => handleFeedbackChange(store.id, e.target.value)}
                        rows="3"
                      />
                    </div>

                    <button
                      className={`submit-btn ${selectedRatings[store.id] ? 'active' : 'disabled'}`}
                      onClick={() => submitRating(store.id)}
                      disabled={!selectedRatings[store.id]}
                    >
                      <FaThumbsUp className="submit-icon" />
                      Submit Rating
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
