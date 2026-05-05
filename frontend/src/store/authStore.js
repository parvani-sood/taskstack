import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  signup: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/signup', userData);
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Signup failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/login', credentials);
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get('/auth/me');
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

export default useAuthStore;
