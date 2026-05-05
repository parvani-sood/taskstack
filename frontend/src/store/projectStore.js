import { create } from 'zustand';
import api from '../api/axios';

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/projects');
      set({ projects: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch projects', isLoading: false });
    }
  },

  fetchProjectById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/projects/${id}`);
      set({ currentProject: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch project', isLoading: false });
    }
  },

  createProject: async (projectData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/projects', projectData);
      set(state => ({ 
        projects: [...state.projects, response.data],
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create project', isLoading: false });
      throw error;
    }
  },

  updateProjectMembers: async (projectId, memberIds) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put(`/projects/${projectId}/members`, { members: memberIds });
      
      // We need to re-fetch the project to get populated member details
      const projectRes = await api.get(`/projects/${projectId}`);
      set({ currentProject: projectRes.data, isLoading: false });
      return projectRes.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update members', isLoading: false });
      throw error;
    }
  },
}));

export default useProjectStore;
