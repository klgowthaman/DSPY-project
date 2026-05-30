/**
 * Axios API client — base instance with JWT auth interceptors.
 * Falls back gracefully when the backend is unavailable.
 */
import axios, { type AxiosInstance, type AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// -------------------------------------------------------
// Request interceptor — inject JWT token
// -------------------------------------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ima_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------------------------------------------------------
// Response interceptor — handle 401 auto-logout
// -------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ima_token');
      localStorage.removeItem('ima_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/** Check if the backend is reachable */
export async function isBackendAvailable(): Promise<boolean> {
  try {
    await axios.get(`${BASE_URL}/health`, { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

export default api;
