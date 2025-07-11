// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = {
  // Auth endpoints
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  
  // User endpoints
  stores: `${API_BASE_URL}/user/stores`,
  rate: `${API_BASE_URL}/user/rate`,
  ratings: `${API_BASE_URL}/user/ratings`,
  
  // Admin endpoints
  adminDashboard: `${API_BASE_URL}/admin/dashboard`,
  adminStores: `${API_BASE_URL}/admin/stores`,
  adminUsers: `${API_BASE_URL}/admin/users`,
  adminSummary: `${API_BASE_URL}/admin/summary`,
  addStore: `${API_BASE_URL}/admin/add-store`,
  addUser: `${API_BASE_URL}/admin/add-user`,
  
  // Owner endpoints
  ownerRatings: `${API_BASE_URL}/owner/ratings`,
  ownerAverageRating: `${API_BASE_URL}/owner/average-rating`,
  
  // Debug endpoint
  users: `${API_BASE_URL}/auth/users`
};

export default api; 