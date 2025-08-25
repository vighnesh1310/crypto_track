// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
