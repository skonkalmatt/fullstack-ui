// src/lib/axios.js
import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// inject Authorization header from localStorage (so it works across reloads)
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("authTokens");
  if (raw) {
    try {
      const { access } = JSON.parse(raw);
      if (access) config.headers.Authorization = `Bearer ${access}`;
    } catch (_) {}
  }
  return config;
});
