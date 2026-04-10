import axios from "axios";

const baseURL = import.meta.env.VITE_URL_BACKEND;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
