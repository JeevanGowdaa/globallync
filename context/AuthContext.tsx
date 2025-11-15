import { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import { mockLogin, mockSignup } from '../services/mockAuth';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export { AuthContext };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
  }, [token]);

  const login = async (email: string, password: string, requireAdmin: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      let mockResponse: any = null;
      let apiSuccess = false;

      try {
        const response = await api.post('/api/auth/login', { email, password });
        const { token: responseToken, user: responseUser } = response.data;

        if (responseToken && responseUser) {
          if (requireAdmin && responseUser.role !== 'admin') {
            throw new Error('This account does not have admin access.');
          }

          localStorage.setItem('token', responseToken);
          setToken(responseToken);
          setUser(responseUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${responseToken}`;
          apiSuccess = true;
        } else {
          throw new Error("Login response did not contain token or user.");
        }
      } catch (apiError: any) {
        console.log('API login failed, trying mock auth:', apiError?.message);
        try {
          mockResponse = await mockLogin(email, password);
        } catch (mockError) {
          throw mockError;
        }
      }

      if (!apiSuccess && mockResponse) {
        if (requireAdmin && mockResponse.user.role !== 'admin') {
          throw new Error('This account does not have admin access.');
        }

        localStorage.setItem('token', mockResponse.token);
        setToken(mockResponse.token);
        setUser(mockResponse.user);
        api.defaults.headers.common['Authorization'] = `Bearer ${mockResponse.token}`;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed.';
      setError(errorMessage);
      console.error('Login error:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      let mockResponse: any = null;
      let apiSuccess = false;

      try {
        const response = await api.post('/api/auth/signup', { name, email, password });
        const { token: responseToken, user: responseUser } = response.data;

        if (responseToken && responseUser) {
          localStorage.setItem('token', responseToken);
          setToken(responseToken);
          setUser(responseUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${responseToken}`;
          apiSuccess = true;
        } else {
          throw new Error("Signup response did not contain token or user.");
        }
      } catch (apiError: any) {
        console.log('API signup failed, trying mock auth:', apiError?.message);
        try {
          mockResponse = await mockSignup(name, email, password);
        } catch (mockError) {
          throw mockError;
        }
      }

      if (!apiSuccess && mockResponse) {
        localStorage.setItem('token', mockResponse.token);
        setToken(mockResponse.token);
        setUser(mockResponse.user);
        api.defaults.headers.common['Authorization'] = `Bearer ${mockResponse.token}`;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Signup failed.';
      setError(errorMessage);
      console.error('Signup error:', errorMessage);
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
}
