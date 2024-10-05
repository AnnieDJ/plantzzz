// src/axiosInstance.tsx
import axios from 'axios';
import backendUrl from './config';

const api = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          // Flash token
          const { data } = await axios.post(`${backendUrl}/api/auth/refresh`, {}, {
            headers: {
              'Authorization': `Bearer ${refreshToken}`,
            },
          });
          localStorage.setItem('access_token', data.access_token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
          return api(originalRequest);  
        } catch (err) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          alert('Session expired. Please log in again.');
          window.location.href = '/login';  
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        alert('Session expired. Please log in again.');
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;
