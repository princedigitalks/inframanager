import api from './api';

export const logService = {
  getAll: async (params?: any) => {
    const { data } = await api.get('/log', { params });
    return data;
  },

  create: async (logData: any) => {
    const { data } = await api.post('/log', logData);
    return data;
  }
};
