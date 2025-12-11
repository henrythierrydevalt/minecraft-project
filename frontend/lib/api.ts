import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

const getToken = () => {
  if (typeof window === 'undefined') return null;
  
  const tokenFromStorage = localStorage.getItem('token');
  if (tokenFromStorage) return tokenFromStorage;
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
  if (tokenCookie) {
    const token = tokenCookie.split('=')[1];
    if (token) {
      localStorage.setItem('token', token);
      return token;
    }
  }
  
  return null;
};

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; max-age=0';
        document.cookie = 'user=; path=/; max-age=0';
        if (window.location.pathname.startsWith('/dashboard')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

