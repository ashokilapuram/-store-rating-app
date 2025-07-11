// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = {
  // Auth endpoints
  login: `${API_BASE_URL}/api/auth/login`,
  register: `${API_BASE_URL}/api/auth/register`,
  
  // User endpoints
  stores: `${API_BASE_URL}/api/user/stores`,
  rate: `${API_BASE_URL}/api/user/rate`,
  ratings: `${API_BASE_URL}/api/user/ratings`,
  
  // Admin endpoints
  adminDashboard: `${API_BASE_URL}/api/admin/dashboard`,
  adminStores: `${API_BASE_URL}/api/admin/stores`,
  adminUsers: `${API_BASE_URL}/api/admin/users`,
  adminOwners: `${API_BASE_URL}/api/admin/owners`,
  adminSummary: `${API_BASE_URL}/api/admin/summary`,
  addStore: `${API_BASE_URL}/api/admin/add-store`,
  addUser: `${API_BASE_URL}/api/admin/add-user`,
  
  // Owner endpoints
  ownerRatings: `${API_BASE_URL}/api/owner/ratings`,
  ownerAverageRating: `${API_BASE_URL}/api/owner/average-rating`,
  
  // Debug endpoint
  users: `${API_BASE_URL}/api/auth/users`
};

export default api; 