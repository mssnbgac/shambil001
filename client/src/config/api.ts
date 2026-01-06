// API Configuration for different environments
declare const process: {
  env: {
    NODE_ENV: string;
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
    
    // Default production URL - will be set via environment variable
    return 'https://your-backend-url.onrender.com/api';
  }
  
  // Development environment
  return 'http://localhost:4000/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Remove /api from base URL for some components that add it
export const API_BASE_URL_NO_API = API_BASE_URL.replace('/api', '');

export default API_BASE_URL;