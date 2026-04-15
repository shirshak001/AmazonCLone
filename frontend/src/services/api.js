import axios from 'axios';

const getBaseURL = () => {
  // Use VITE_BACKEND_URL environment variable if available
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  
  // Development: use localhost
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  
  // Production fallback: use relative path
  return '/api';
};

export const getBackendURL = () => {
  // Use VITE_BACKEND_URL environment variable if available
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL.replace('/api', '');
  }
  
  // Development: use localhost
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  
  // Production fallback: use relative path
  return '';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

// Products
export const fetchProducts = (params = {}) => api.get('/products', { params });
export const fetchProduct = (id) => api.get(`/products/${id}`);

// Cart
export const fetchCart = () => api.get('/cart');
export const addToCartApi = (productId, quantity = 1) => api.post('/cart', { productId, quantity });
export const updateCartItemApi = (productId, quantity) => api.put(`/cart/${productId}`, { quantity });
export const removeFromCartApi = (productId) => api.delete(`/cart/${productId}`);
export const clearCartApi = () => api.delete('/cart/clear');

// Orders
export const placeOrderApi = (address) => api.post('/orders', { address });
export const fetchOrder = (id) => api.get(`/orders/${id}`);

export default api;
