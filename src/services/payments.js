// src/services/payments.js
import api from './api';

export const getPayments = () => api.get('/payments');
export const getPayment = id => api.get(`/payments/${id}`);
export const createPayment = data => api.post('/payments', data);
export const deletePayment = id => api.delete(`/payments/${id}`);
