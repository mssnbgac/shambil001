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
    // For Vercel deployment - use current domain
    if (typeof window !== 'undefined') {
      // Browser environment - use current domain
      return `${window.location.origin}/api`;
    }
    
    // For custom domain (set via environment variable)
    const customApiUrl = process.env.REACT_APP_API_URL;
    if (customApiUrl) {
      return customApiUrl;
    }
    
    // Default production URL (fallback)
    return '/api';
  }
  
  // Development environment
  return 'http://localhost:4000/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Remove /api from base URL for some components that add it
export const API_BASE_URL_NO_API = API_BASE_URL.replace('/api', '');

export default API_BASE_URL;