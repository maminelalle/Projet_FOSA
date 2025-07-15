// ✅ src/services/api.js
import axios from 'axios';

// Crée une instance Axios avec l'URL de ton backend
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Ajoute le token automatiquement à chaque requête
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gère le cas où le token est expiré ➜ tente un refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh_token = localStorage.getItem('refresh_token');
        const response = await axios.post('http://127.0.0.1:8000/api/auth/token/refresh/', {
          refresh: refresh_token,
        });

        localStorage.setItem('access_token', response.data.access);

        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error('🔒 Token refresh failed:', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default API;
