// API Configuration for different environments

// Declare environment variables for TypeScript
declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
    REACT_APP_API_URL?: string;
  };
};

const getApiBaseUrl = (): string => {
  // Use React's built-in environment variable handling
  const nodeEnv = process.env.NODE_ENV;
  
  if (nodeEnv === 'production') {
    // For separate deployment (Frontend: Vercel, Backend: Render)
    const customApiUrl = process.env.REACT_APP_API_URL;
    if (customApiUrl) {
      return customApiUrl;
    }
    
    // Default production URL - Backend is deployed on Render
    return 'https://shambil001.onrender.com/api';
  }
  
  // Development environment
  return 'http://localhost:4000/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Remove /api from base URL for some components that add it
export const API_BASE_URL_NO_API = API_BASE_URL.replace('/api', '');

export default API_BASE_URL;