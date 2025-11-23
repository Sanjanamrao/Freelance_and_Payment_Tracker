

// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  res => res,
  err => {
    const msg = err?.response?.data?.message || err.message || 'Request failed';
    console.error('API error:', msg);
    return Promise.reject(err);
  }
);

export default api;
