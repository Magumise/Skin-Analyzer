import axios from 'axios';

// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(new Error('Network error. Please check your internet connection and try again.'));
    }

    // Handle CORS errors
    if (error.message && error.message.includes('CORS')) {
      console.error('CORS Error:', error);
      return Promise.reject(new Error('Unable to connect to the server. Please try again later.'));
    }

    // Handle 401 Unauthorized errors
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem('access_token', response.data.access);

        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
    }

    // Handle other errors
    const errorMessage = error.response.data?.detail || error.response.data?.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// Authentication API methods
export const authAPI = {
  // Register new user
  register: (userData: any) => api.post('/api/users/', userData),

  // Login user
  login: (credentials: { email: string; password: string }) =>
    api.post('/api/token/', credentials),

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/users/logout/');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear tokens even if the request fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw error;
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.post('/users/token/verify/');
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  },

  // Refresh token
  refreshToken: (refresh: string) => api.post('/api/token/refresh/', { refresh }),
};

export const productAPI = {
  getAll: () => api.get('/api/products/'),
  create: (product: any) => api.post('/api/products/', product),
  update: (id: number, product: any) => api.put(`/api/products/${id}/`, product),
  delete: (id: number) => api.delete(`/api/products/${id}/`),
  updateImage: (id: number, image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    return api.patch(`/api/products/${id}/update_image/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const analysisAPI = {
  uploadImage: (image: File) => {
    const formData = new FormData();
    formData.append('file', image);
    return api.post('/api/images/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  analyzeImage: (imageId: number, analysisData: any) =>
    api.post(`/api/images/${imageId}/analyze/`, analysisData),
};

export const testAIModel = async (image: File) => {
  const formData = new FormData();
  formData.append('file', image);
  return api.post('/api/test-ai/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default api;