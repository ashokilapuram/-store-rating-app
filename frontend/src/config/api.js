// API Configuration
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5000'
  },
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://store-rating-app-g8m7.onrender.com'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_BASE_URL = API_CONFIG[environment].baseURL;

// Log the API URL for debugging
console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', environment);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

export default API_BASE_URL; 