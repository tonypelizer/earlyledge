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

// Callback registered by App so the interceptor can trigger a logout when
// the refresh token itself has expired.
let onUnauthenticated: (() => void) | null = null;
export const setOnUnauthenticated = (callback: () => void) => {
  onUnauthenticated = callback;
};

// --- Silent token-refresh interceptor ---
// Queues concurrent 401 requests while a refresh is in flight, retries them
// once a new access token is obtained, and triggers a full logout if the
// refresh token has also expired.
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  for (const prom of failedQueue) {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  }
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refreshToken");

      // No refresh token stored – nothing we can do, propagate the error.
      if (!refreshToken) {
        return Promise.reject(error);
      }

      // Another refresh is already in flight – queue this request.
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });
        const newAccessToken: string = data.access;
        localStorage.setItem("token", newAccessToken);
        setAuthToken(newAccessToken);
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh token is expired or invalid – clear everything and log out.
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail");
        setAuthToken(null);
        onUnauthenticated?.();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
