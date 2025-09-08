import axios from "axios";

const API = axios.create({
  baseURL: `https://${window.location.hostname}:3000/api`,
});

// Attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
