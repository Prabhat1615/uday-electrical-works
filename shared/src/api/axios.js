import axios from 'axios';

/**
 * Resolves and normalizes the backend API base URL.
 * Handles cases where VITE_API_URL is provided with or without trailing /api,
 * trailing slashes, or omitted altogether.
 */
export const getApiBaseUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL || '';
  const cleanUrl = rawUrl.trim().replace(/\/+$/, '');

  if (!cleanUrl) {
    return '/api';
  }
  if (cleanUrl.endsWith('/api')) {
    return cleanUrl;
  }
  return `${cleanUrl}/api`;
};

/**
 * Resolves the Socket.IO server target URL.
 * Prefers VITE_SOCKET_URL if set, otherwise derives from VITE_API_URL,
 * or falls back to production backend / local dev.
 */
export const getSocketTargetUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL.trim().replace(/\/+$/, '').replace(/\/api$/, '');
  }
  if (import.meta.env.VITE_API_URL) {
    const cleanApi = import.meta.env.VITE_API_URL.trim().replace(/\/+$/, '');
    return cleanApi.replace(/\/api$/, '');
  }
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  return 'https://uday-electrical-works.onrender.com';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to append Authorization Token
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('uew_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error('Failed to parse cached user token', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global 401 unauthorized
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid credentials
      localStorage.removeItem('uew_user');
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
