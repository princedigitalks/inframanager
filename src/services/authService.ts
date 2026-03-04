import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  login: (data: LoginData) => api.post('/user/login', data),
};
