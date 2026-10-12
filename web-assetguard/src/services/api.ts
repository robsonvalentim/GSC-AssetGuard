import axios from 'axios';

// Cria uma instância centralizada do Axios apontando para o nosso backend NestJS
export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Interceptor: Injeta o token JWT automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});