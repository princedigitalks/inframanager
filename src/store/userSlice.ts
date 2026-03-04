import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userService, User, CreateUserData, UpdateUserData } from '../services/userService';

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  total: number;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  total: 0,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    const response = await userService.getUsers(params);
    return response.data;
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: string) => {
    const response = await userService.getUserById(id);
    return response.data;
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (data: CreateUserData) => {
    const response = await userService.createUser(data);
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }: { id: string; data: UpdateUserData }) => {
    const response = await userService.updateUser(id, data);
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string) => {
    await userService.deleteUser(id);
    return id;
  }
);

export const updateUserStatus = createAsyncThunk(
  'users/updateUserStatus',
  async ({ id, status }: { id: string; status: 'active' | 'inactive' }) => {
    const response = await userService.updateUserStatus(id, status);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.currentUser = action.payload.data;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload.data);
        state.total += 1;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload.data._id);
        if (index !== -1) state.users[index] = action.payload.data;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload);
        state.total -= 1;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload.data._id);
        if (index !== -1) state.users[index] = action.payload.data;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
