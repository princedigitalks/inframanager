import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService, LoginData } from '../services/authService';

interface AuthState {
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginData) => {
    const response = await authService.login(data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }
);

export const initAuth = createAsyncThunk(
  'auth/init',
  async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return { token };
    }
    return { token: null };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
