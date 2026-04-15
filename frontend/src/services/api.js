import axios from 'axios';

const getBaseURL = () => {
  // Production (Vercel): use relative path to backend
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return '/_/backend/api';
  }
  // Development: use localhost
  return 'http://localhost:5000/api';
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
