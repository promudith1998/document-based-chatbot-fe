import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUser({ username: storedUsername });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await authAPI.login({ username, password });
    const { token: newToken, username: name } = response.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', name);
    setToken(newToken);
    setUser({ username: name });
    return response.data;
  };

  const register = async (username, password) => {
    const response = await authAPI.register({ username, password });
    const { token: newToken, username: name } = response.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', name);
    setToken(newToken);
    setUser({ username: name });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
