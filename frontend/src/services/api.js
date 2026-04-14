import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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
