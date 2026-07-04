import api from './api';

// Order Endpoints
export const fetchAllOrders = () => api.get('/Orders');
export const fetchOrderById = (id) => api.get(`/Orders/${id}`);
export const createOrder = (payload) => api.post('/Orders', payload);
export const updateOrder = (id, payload) => api.put(`/Orders/${id}`, payload);

// System Data Endpoints (For Dropdowns)
export const fetchClients = () => api.get('/Clients');
export const fetchItems = () => api.get('/Items');