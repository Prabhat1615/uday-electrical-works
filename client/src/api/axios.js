import axios from 'axios';

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
