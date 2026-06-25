import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    const token = localStorage.getItem('phonepay_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/profile');
      setUser(data);
    } catch (err) {
      localStorage.removeItem('phonepay_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('phonepay_token', data.token);
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('phonepay_token', data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('phonepay_token');
    setUser(null);
  };

  // Call after balance-changing actions or mpin setup to refresh user state
  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      setUser(data);
    } catch (err) {
      // silent - profile fetch failure shouldn't crash the UI
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
