// API Configuration for different environments

const getApiBaseUrl = (): string => {
  // Simple environment detection without process.env
  const isProduction = window.location.hostname !== 'localhost' && 
                      window.location.hostname !== '127.0.0.1' &&
                      !window.location.hostname.includes('localhost');
  
  if (isProduction) {
    // Production environment - Backend is deployed on Render
    return 'https://shambil001.onrender.com/api';
  }
  
  // Development environment
  return 'http://localhost:4000/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Remove /api from base URL for some components that add it
export const API_BASE_URL_NO_API = API_BASE_URL.replace('/api', '');

export default API_BASE_URL;