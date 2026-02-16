import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('accessToken', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const response = await axios.post(`${API_BASE_URL}/token/`, {
      username,
      password,
    });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/users/me/');
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/categories/${id}/`);
    return response.data;
  },
  
  getProducts: async (id) => {
    const response = await api.get(`/categories/${id}/products/`);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/products/', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },
  
  getFeatured: async () => {
    const response = await api.get('/products/featured/');
    return response.data;
  },
  
  search: async (query) => {
    const response = await api.get('/products/search/', {
      params: { q: query },
    });
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  getAll: async () => {
    const response = await api.get('/orders/');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },
  
  create: async (orderData) => {
    const response = await api.post('/orders/', orderData);
    return response.data;
  },
  
  cancel: async (id) => {
    const response = await api.patch(`/orders/${id}/cancel/`);
    return response.data;
  },
  
  getMyOrders: async () => {
    const response = await api.get('/orders/my_orders/');
    return response.data;
  },
};

export default api;