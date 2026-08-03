import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('syllotrack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle unauthenticated 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid token if present
      const currentToken = localStorage.getItem('syllotrack_token');
      if (currentToken) {
        localStorage.removeItem('syllotrack_token');
        localStorage.removeItem('syllotrack_user');
        // Dispatch custom event so AuthContext can update state
        window.dispatchEvent(new Event('syllotrack_auth_expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
