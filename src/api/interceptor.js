import axios from "axios";
import store from "../store";
import { clearToken } from "../slices/authSlice";
import { API_BASE_URL } from "../config/config";

const api = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("error-----------", error);
    
    const status = error.response.status;
    if (status === 401) {
      store.dispatch(clearToken());
      localStorage.removeItem("authToken");
      localStorage.removeItem("tokenExpiry");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
