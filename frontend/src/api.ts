import axios from "axios";

// In production the frontend is served by Django on the same origin,
// so a relative path works everywhere without any env var.
// Override with VITE_API_BASE_URL in .env.local for local dev if needed.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};
