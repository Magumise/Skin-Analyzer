import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://ai-skin-analyzer-backend-patg.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
});

// Add request interceptor to handle CORS
api.interceptors.request.use(
  (config) => {
    // Add token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export const register = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('/api/users/register/', userData, {
      timeout: 30000 // 30 seconds timeout for registration
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.email) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await api.post('/api/users/login/', credentials, {
      timeout: 30000 // 30 seconds timeout for login
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Invalid credentials');
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/api/auth/logout/', {}, {
      timeout: 30000 // 30 seconds timeout for logout
    });
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/user/', {
      timeout: 30000 // 30 seconds timeout for getting user data
    });
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

export default api; 