// API Configuration
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5000'
  },
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://your-railway-backend-url.railway.app'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_BASE_URL = API_CONFIG[environment].baseURL;

export default API_BASE_URL; 