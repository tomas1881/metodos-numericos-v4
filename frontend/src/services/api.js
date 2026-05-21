import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

export const metodosAPI = {
  getMetodos: () => api.get('/metodos'),
  getTiposInterpolacion: () => api.get('/tipos_interpolacion'),
  
  biseccion: (data) => api.post('/biseccion', data),
  newton: (data) => api.post('/newton', data),
  simpson: (data) => api.post('/simpson', data),
  trapecio: (data) => api.post('/trapecio', data),
  interpolacion: (data) => api.post('/interpolacion', data),
  jacobi: (data) => api.post('/jacobi', data),
  gaussSeidel: (data) => api.post('/gauss_seidel', data),
};