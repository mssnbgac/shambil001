import axios from 'axios';

// Create axios instance with base configuration
import API_BASE_URL from '../config/api';

const API_BASE_URL_UTILS = process.env.NODE_ENV === 'production' 
  ? API_BASE_URL  // Use dynamic API URL
  : 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL_UTILS,
  timeout: 10000,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('🔑 Token from localStorage:', token ? 'Present' : 'Missing');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Authorization header added');
  } else {
    console.log('❌ No token found in localStorage');
  }
  return config;
});

export default api;