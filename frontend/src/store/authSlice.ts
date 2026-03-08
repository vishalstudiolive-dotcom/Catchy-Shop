import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Address } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
}

const loadAuth = (): AuthState => {
  try {
    const token = localStorage.getItem('catchy_token');
    const user = JSON.parse(localStorage.getItem('catchy_user') || 'null');
    const addresses = JSON.parse(localStorage.getItem('catchy_addresses') || '[]');
    return { user, token, isAuthenticated: !!token, addresses, isLoading: false, error: null };
  } catch { 
    return { user: null, token: null, isAuthenticated: false, addresses: [], isLoading: false, error: null }; 
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuth() as AuthState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('catchy_token', action.payload.token);
      localStorage.setItem('catchy_user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null; state.token = null; state.isAuthenticated = false; state.addresses = [];
      state.error = null;
      localStorage.removeItem('catchy_token');
      localStorage.removeItem('catchy_user');
      localStorage.removeItem('catchy_addresses');
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('catchy_token', action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) { state.user = { ...state.user, ...action.payload }; localStorage.setItem('catchy_user', JSON.stringify(state.user)); }
    },
    setAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
      localStorage.setItem('catchy_addresses', JSON.stringify(action.payload));
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      if (action.payload.isDefault) state.addresses.forEach(a => a.isDefault = false);
      state.addresses.push(action.payload);
      localStorage.setItem('catchy_addresses', JSON.stringify(state.addresses));
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter(a => a._id !== action.payload);
      localStorage.setItem('catchy_addresses', JSON.stringify(state.addresses));
    },
  }
});

export const { login, logout, setToken, setLoading, setError, updateProfile, setAddresses, addAddress, removeAddress } = authSlice.actions;
export default authSlice.reducer;
