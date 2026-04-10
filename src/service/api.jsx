import api from '../service/api';

const baseURL = import.meta.env.VITE_URL_BACKEND;

const api = api.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
