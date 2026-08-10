import React, { createContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getProfileApi } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('uew_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (user?.token) {
        try {
          const res = await getProfileApi();
          if (res?.data) {
            const updated = { ...user, ...res.data };
            setUser(updated);
            localStorage.setItem('uew_user', JSON.stringify(updated));
          }
        } catch (err) {
          console.warn('Session expired or server error:', err.message);
          logout();
        }
      }
      setLoading(false);
    };
    verifyAuth();
  }, []);

  const login = async (credentials) => {
    const response = await loginApi(credentials);
    if (response?.data) {
      setUser(response.data);
      localStorage.setItem('uew_user', JSON.stringify(response.data));
    }
    return response;
  };

  const register = async (userData) => {
    const response = await registerApi(userData);
    if (response?.data) {
      setUser(response.data);
      localStorage.setItem('uew_user', JSON.stringify(response.data));
    }
    return response;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('uew_user');
  };

  const updateUser = (data) => {
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('uew_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user?.token,
        role: user?.role || 'Guest',
        loading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
