
import axios from 'axios';

const api = axios.create({
  // baseURL is removed to prevent "Invalid URL" errors in some environments.
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
