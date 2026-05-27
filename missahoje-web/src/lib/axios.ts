import axios from 'axios';

// URL base da API (pode ser configurada via variável de ambiente no futuro)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor de Request para injetar o Token
api.interceptors.request.use(
  (config) => {
    // Exemplo: se o token for armazenado em cookies ou localStorage, buscamos aqui
    // const token = getCookie('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response para tratamento global de erros (ex: token expirado)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Redirecionar para login ou limpar cookie, dependendo da rota
      console.error('Não autorizado ou Token expirado.');
    }
    return Promise.reject(error);
  }
);
