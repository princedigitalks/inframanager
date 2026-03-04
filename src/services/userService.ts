import api from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  designation?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  department?: string;
  designation?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  designation?: string;
  password?: string;
}

export const userService = {
  getUsers: (params?: { page?: number; limit?: number; status?: string; search?: string }) =>
    api.get('/user', { params }),
  
  getUserById: (id: string) =>
    api.get(`/user/${id}`),
  
  createUser: (data: CreateUserData) =>
    api.post('/user', data),
  
  updateUser: (id: string, data: UpdateUserData) =>
    api.put(`/user/${id}`, data),
  
  deleteUser: (id: string) =>
    api.delete(`/user/${id}`),
  
  updateUserStatus: (id: string, status: 'active' | 'inactive') =>
    api.patch(`/user/${id}/status`, { status }),
};
