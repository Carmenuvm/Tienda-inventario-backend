// src/services/api.js/ agg api para manejar crud
import axios from 'axios';

// Crear una instancia de Axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Interceptor para agregar el token a las solicitudes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Agregar el token al encabezado
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Función para iniciar sesión
export const login = (credentials) => api.post('/auth/login', credentials);

// Función para el crud de los productos
export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = async (product) => {
  return await api.post('/products', product);
};
export const updateProduct = (id, formData) => {
  return api.put(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getCategories = () => api.get('/products/categories');

// src/services/api.js
export const getUsers = () => api.get('/users/users');
export const updateUser = (id, userData) => api.put(`/users/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/users/${id}`);

// Función para actualizar el perfil
export const updateProfile = async (userData) => {
  return await api.put('/users/profile', userData); // Asegúrate de que esta ruta sea correcta
};

export default api;