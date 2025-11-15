import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedUser: User = jwtDecode(token);
        setUser(decodedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        console.error("Invalid token:", e);
        logout();
      }
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // API call to the backend login endpoint
      const response = await api.post('/api/auth/login', { email, password });
      
      const { token: responseToken, user: responseUser } = response.data;

      if (responseToken && responseUser) {
        localStorage.setItem('token', responseToken);
        setToken(responseToken);
        setUser(responseUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${responseToken}`;
      } else {
         throw new Error("Login response did not contain token or user.");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // API call to the backend signup endpoint
      const response = await api.post('/api/auth/signup', { name, email, password });
      
      const { token: responseToken, user: responseUser } = response.data;

       if (responseToken && responseUser) {
        localStorage.setItem('token', responseToken);
        setToken(responseToken);
        setUser(responseUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${responseToken}`;
      } else {
         throw new Error("Signup response did not contain token or user.");
      }

    // FIX: Corrected the malformed catch block which was causing numerous scope and syntax errors.
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const value = { user, token, loading, error, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
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
