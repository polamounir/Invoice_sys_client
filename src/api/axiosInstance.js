import axios from "axios";
import { store } from "../app/store";
import { logout } from "../app/slices/authSlice";

let isLoggingOut = false;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && !isLoggingOut) {
      isLoggingOut = true;
      store.dispatch(logout());
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
