import { create } from 'zustand';
import api from '../api/axios';

const useTaskStore = create((set) => ({
  tasks: [], // Dashboard tasks
  projectTasks: [], // Tasks for a specific project
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/tasks');
      set({ tasks: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch tasks', isLoading: false });
    }
  },

  fetchTasksByProject: async (projectId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/projects/${projectId}/tasks`);
      set({ projectTasks: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch project tasks', isLoading: false });
    }
  },

  createTask: async (taskData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/tasks', taskData);
      set(state => ({ 
        projectTasks: [...state.projectTasks, response.data],
        tasks: [...state.tasks, response.data], // Optionally add to dashboard tasks if assigned to current user
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create task', isLoading: false });
      throw error;
    }
  },

  updateTaskStatus: async (taskId, status) => {
    try {
      set({ error: null });
      const response = await api.put(`/tasks/${taskId}/status`, { status });
      
      // Update both lists
      set(state => ({
        tasks: state.tasks.map(t => t._id === taskId ? { ...t, status: response.data.status } : t),
        projectTasks: state.projectTasks.map(t => t._id === taskId ? { ...t, status: response.data.status } : t)
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update task status' });
      throw error;
    }
  }
}));

export default useTaskStore;
