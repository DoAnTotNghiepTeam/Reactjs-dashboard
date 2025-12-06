/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios, { type InternalAxiosRequestConfig } from 'axios';

const URL = 'http://localhost:8080';

const apiClient = Axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
  const authStorage = localStorage.getItem('auth-storage-for-login') ? JSON.parse(localStorage.getItem('auth-storage-for-login')!) : null;

    const access_token = authStorage?.state?.access_token;

    if (config.headers === undefined) {
      config.headers = new Axios.AxiosHeaders();
    }

    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }

    config.headers.Accept = 'application/json';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url === '/api/auth/login') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('Authentication failed, redirecting to login');
      localStorage.removeItem('auth-storage-for-login');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;