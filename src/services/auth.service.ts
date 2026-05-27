import api from './api';

export interface LoginPayload { email: string; password: string; }
export interface SignupPayload { name: string; email: string; password: string; company?: string; workspace_name?: string; }

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem('ima_token', data.access_token);
    localStorage.setItem('ima_user', JSON.stringify(data.user));
    return data;
  },

  async signup(payload: SignupPayload) {
    const { data } = await api.post('/auth/signup', payload);
    localStorage.setItem('ima_token', data.access_token);
    localStorage.setItem('ima_user', JSON.stringify(data.user));
    return data;
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  logout() {
    localStorage.removeItem('ima_token');
    localStorage.removeItem('ima_user');
  },

  getStoredUser() {
    try {
      const raw = localStorage.getItem('ima_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  getToken() {
    return localStorage.getItem('ima_token');
  },
};
