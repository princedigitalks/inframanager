import api from './api';

export const serverService = {
  getAll: async (params?: any) => {
    const { data } = await api.get('/server', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/server/${id}`);
    return data;
  },

  decryptCredentials: async (id: string) => {
    const { data } = await api.get(`/server/${id}/decrypt`);
    return data;
  },

  create: async (serverData: any) => {
    const { data } = await api.post('/server', serverData);
    return data;
  },

  update: async (id: string, serverData: any) => {
    const { data } = await api.put(`/server/${id}`, serverData);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/server/${id}`);
    return data;
  }
};
