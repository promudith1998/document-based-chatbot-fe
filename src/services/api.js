import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const conversationsAPI = {
  getAll: () => api.get('/conversations'),
  getOne: (id) => api.get(`/conversations/${id}`),
  create: (title) => api.post('/conversations', { title }),
  sendMessage: (id, message, documentId = null) => api.post(`/conversations/${id}/messages`, { message, documentId }),
  delete: (id) => api.delete(`/conversations/${id}`),
};

export const documentsAPI = {
  getAll: () => api.get('/documents'),
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  delete: (id) => api.delete(`/documents/${id}`),
};

export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

export default api;
