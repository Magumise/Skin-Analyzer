import axios from 'axios';

// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'https://ai-skin-analyzer-nw9c.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 30000, // Increased timeout
});

// Add request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error);

    // Handle CORS errors
    if (error.message && error.message.includes('CORS')) {
      console.error('CORS Error:', error);
      throw new Error('Unable to connect to the server. Please try again later.');
    }

    // Handle network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      console.error('Network Error:', error);
      throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
    }

    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_URL}/api/users/token/refresh/`, {
          refresh: refreshToken
        });

        if (response.data && response.data.access) {
          localStorage.setItem('access_token', response.data.access);
          
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error(error.response.data.detail || 'Invalid request data');
        case 401:
          throw new Error('Unauthorized access. Please log in again.');
        case 403:
          throw new Error('You do not have permission to perform this action.');
        case 404:
          throw new Error('The requested resource was not found.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(error.response.data.detail || 'An error occurred. Please try again.');
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      console.log('Attempting login with:', credentials);
      const response = await api.post('/api/users/login/', credentials);
      console.log('Login response:', response.data);
      if (response.data && response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
      }
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data) {
        throw new Error(error.response.data.detail || 'Login failed. Please check your credentials.');
      }
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      console.log('Attempting registration with:', userData);
      const response = await api.post('/api/users/register/', userData);
      console.log('Registration response:', response.data);
      if (response.data && response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
      }
      return response;
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response?.data) {
        const errors = error.response.data;
        const errorMessage = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        throw new Error(errorMessage || 'Registration failed. Please check your input and try again.');
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/api/users/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  verifyToken: async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return false;
      }

      await api.post('/api/users/token/verify/', { token });
      return true;
    } catch (error) {
      return false;
    }
  }
};