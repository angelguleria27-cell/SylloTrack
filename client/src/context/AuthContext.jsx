import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('syllotrack_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('syllotrack_token'));
  const [loading, setLoading] = useState(true);

  // Check auth state on mount or token change
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('syllotrack_token');
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
        localStorage.setItem('syllotrack_user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Failed to verify token:', error);
        localStorage.removeItem('syllotrack_token');
        localStorage.removeItem('syllotrack_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();

    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('syllotrack_token');
      localStorage.removeItem('syllotrack_user');
    };

    window.addEventListener('syllotrack_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('syllotrack_auth_expired', handleAuthExpired);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: newToken, ...userData } = response.data;
    
    localStorage.setItem('syllotrack_token', newToken);
    localStorage.setItem('syllotrack_user', JSON.stringify(userData));
    
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { token: newToken, ...userData } = response.data;

    localStorage.setItem('syllotrack_token', newToken);
    localStorage.setItem('syllotrack_user', JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('syllotrack_token');
    localStorage.removeItem('syllotrack_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
