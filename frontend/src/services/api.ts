import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://ai-skin-analyzer-nw9c.onrender.com';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Changed to true for CORS
  timeout: 10000,
});

// Create a separate axios instance for the AI model
const aiModelApi = axios.create({
  baseURL: 'https://us-central1-aurora-457407.cloudfunctions.net/predict',
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: false,
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
    console.error('API Error:', error.response?.data || error.message);
    
    if (!error.response) {
      // Network error or server not responding
      throw new Error('Network error. Please check your internet connection.');
    }

    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_URL}/api/users/token/refresh/`, {
          refresh: refreshToken
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle specific error cases
    if (error.response.status === 400) {
      throw new Error(error.response.data.message || 'Invalid request');
    } else if (error.response.status === 403) {
      throw new Error('Access denied');
    } else if (error.response.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      console.log('Attempting login with:', { email: credentials.email });
      const response = await api.post('/api/users/login/', credentials);
      console.log('Login response:', response.data);
      
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
      }
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  register: async (userData: any) => {
    try {
      console.log('Attempting registration with:', { email: userData.email });
      const response = await api.post('/api/users/register/', userData);
      console.log('Registration response:', response.data);
      return response;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  verifyEmail: async (data: { uid: string; token: string }) => {
    try {
      console.log('Attempting email verification');
      const response = await api.post('/api/users/verify-email/', data);
      console.log('Email verification response:', response.data);
      return response;
    } catch (error) {
      console.error('Email verification error:', error.response?.data || error.message);
      throw error;
    }
  },
};

// Image API
export const imageAPI = {
  uploadImage: (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post('/analysis/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  analyzeImage: (imageId: number) => 
    api.post(`/analysis/${imageId}/analyze/`),
    
  analyzeWithAIModel: async (imageFile: File) => {
    console.log('Analyzing image with cloud AI model:', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      fileType: imageFile.type
    });

    // Check if user is logged in
    const token = localStorage.getItem('token');
    let imageId = null;
    let imageUrl = null;

    // Only try to upload to backend if user is logged in
    if (token) {
      try {
        // First upload the image to the backend
        const uploadResponse = await imageAPI.uploadImage(imageFile);
        imageId = uploadResponse.data.id;
        imageUrl = uploadResponse.data.image_url;
        console.log('Image uploaded to backend:', imageId);
      } catch (error) {
        console.error('Error uploading image to backend:', error);
        // Continue with AI analysis even if backend upload fails
      }
    }

    // Then analyze with the cloud AI model
    const formData = new FormData();
    formData.append('file', imageFile);
    
    // Add retry logic for AI model analysis
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const response = await axios.post(
          'https://us-central1-aurora-457407.cloudfunctions.net/predict',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            timeout: 60000, // 60 seconds timeout
          }
        );

        // Only try to store analysis result if user is logged in and image was uploaded
        if (token && imageId) {
          try {
            // Store the analysis result in the backend
            const analysisResult = {
              image_id: imageId,
              condition: response.data.condition,
              confidence: response.data.confidence,
              recommendation_type: response.data.recommendation_type,
              message: response.data.message,
            };
            
            await api.post('/analysis-results/', analysisResult);
            console.log('Analysis result stored in backend');
          } catch (error) {
            console.error('Error storing analysis result in backend:', error);
            // Continue even if storing result fails
          }
        }

        console.log('Cloud AI model response:', response.data);
        return {
          ...response.data,
          image_id: imageId,
          image_url: imageUrl
        };
      } catch (error) {
        retryCount++;
        if (retryCount === maxRetries) {
          console.error('Error analyzing image with cloud AI model after retries:', error);
          throw new Error('Failed to analyze image after multiple attempts. Please try again later.');
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }
  },
};

// Product API
export const productAPI = {
  getProducts: () =>
    api.get('/api/products/'),
  
  getProduct: (id: number) =>
    api.get(`/api/products/${id}/`),
    
  createProduct: (productData: any) =>
    api.post('/api/products/add/', productData),
    
  updateProduct: (id: number, productData: any) =>
    api.put(`/api/products/${id}/`, productData),
    
  deleteProduct: (id: number) =>
    api.delete(`/api/products/${id}/`),
    
  updateProductImage: (id: number, imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.patch(`/api/products/${id}/image/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Consultation API
export const consultationAPI = {
  createConsultation: (consultationData: { 
    date: string; 
    message: string; 
  }) => 
    api.post('/consultations/create/', consultationData),
  
  getUserConsultations: () => 
    api.get('/consultations/user/'),
};

// Test function to verify AI model endpoint
export const testAIModel = async () => {
  try {
    // Create a simple test image (1x1 pixel)
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 1, 1);
    }
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/jpeg');
    });
    
    // Create file from blob
    const testFile = new File([blob], 'test.jpg', { type: 'image/jpeg' });
    
    // Create form data
    const formData = new FormData();
    formData.append('file', testFile);
    
    // Send test request
    const response = await aiModelApi.post('', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('AI Model Test Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('AI Model Test Error:', error);
    throw error;
  }
};

export default api; 