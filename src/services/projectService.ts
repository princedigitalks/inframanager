import api from './api';

export const projectService = {
  getAll: async (params?: any) => {
    const { data } = await api.get('/project', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/project/${id}`);
    return data;
  },

  create: async (projectData: any) => {
    const { data } = await api.post('/project', projectData);
    return data;
  },

  update: async (id: string, projectData: any) => {
    const { data } = await api.put(`/project/${id}`, projectData);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/project/${id}`);
    return data;
  }
};
