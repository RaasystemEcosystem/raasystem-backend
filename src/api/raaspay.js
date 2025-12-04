// src/api/raaspay.js
import axios from 'axios';

// Dynamic backend URL: set VITE_BACKEND_URL in frontend .env
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/raaspay';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // optional: 10-second timeout
});

// ✅ Healthcheck
export const healthCheck = () => api.get('/health');

// ✅ Get all payments
export const listPayments = () => api.get('/payments');

// ✅ Create new payment
export const createPayment = (data) => api.post('/transfer', data);

// ✅ Check fake balance
export const checkBalance = (address) => api.get(`/balance/${address}`);

export default api;
