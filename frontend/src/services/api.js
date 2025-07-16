// // ✅ src/services/api.js
// import axios from 'axios';

// // Crée une instance Axios avec l'URL de ton backend
// const API = axios.create({
//   baseURL: 'http://127.0.0.1:8000/api/',
// });

// // Mets tes tokens directement ici (⚠️ temporaire !)
// const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUyNjE1MTE4LCJpYXQiOjE3NTI2MTQ4MTgsImp0aSI6IjJmZTkwNzJkMGE0MzQ5NjQ5NWIwYTZmODg1MTYxNDJiIiwidXNlcl9pZCI6Mn0.7cULqDNINWv8OuKFTwz15XGD5c9myD-RWAN2QWXkXas";
// const REFRESH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjcwMTIxOCwiaWF0IjoxNzUyNjE0ODE4LCJqdGkiOiJhYTMxZGU2MTQ1YWE0NTdhYjYzZmRhYjM0YTQ5OWQ5YSIsInVzZXJfaWQiOjJ9.C6QZwrJI2jOFs4bVOAAQ819x3-AQ2YDMxcy2OLp-W7k";

// // Intercepteur pour ajouter le token
// API.interceptors.request.use(
//   (config) => {
//     config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Gère le refresh si token expiré
// API.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       try {
//         const response = await axios.post('http://127.0.0.1:8000/api/auth/token/refresh/', {
//           refresh: REFRESH_TOKEN,
//         });

//         // Met à jour le token d'accès temporairement
//         const newAccess = response.data.access;

//         originalRequest.headers.Authorization = `Bearer ${newAccess}`;
//         return API(originalRequest);

//       } catch (refreshError) {
//         console.error('🔒 Token refresh failed:', refreshError);
//         window.location.href = '/login';
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default API;



import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Intercepteur pour les requêtes
API.interceptors.request.use(config => {
  // Ne pas mettre Content-Type pour FormData
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  // Ajout du token JWT s'il existe
  const token = localStorage.getItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUyNjI3NTA1LCJpYXQiOjE3NTI2MjcyMDUsImp0aSI6Ijc3ZjBiNjQwN2ZjMTQ0MTdiZjlhMDMxN2I3ZWU0NjFhIiwidXNlcl9pZCI6MX0.NC39tjlFR9ko2TistXi2fkmqy4Pyllc2xrMHB9q694Q');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Intercepteur pour les réponses
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUyNjI3NTA1LCJpYXQiOjE3NTI2MjcyMDUsImp0aSI6Ijc3ZjBiNjQwN2ZjMTQ0MTdiZjlhMDMxN2I3ZWU0NjFhIiwidXNlcl9pZCI6MX0.NC39tjlFR9ko2TistXi2fkmqy4Pyllc2xrMHB9q694Q');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;