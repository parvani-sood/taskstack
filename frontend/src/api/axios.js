import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Important for cookies
});

// Response interceptor for handling 401s and refreshing token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      try {
        await api.get('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, we should clear the auth state (handled by the store)
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
