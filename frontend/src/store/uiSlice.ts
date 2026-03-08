import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Toast } from '../types';

interface UIState {
  toasts: Toast[];
  recentlyViewed: string[];
  cookieConsent: boolean;
  searchOpen: boolean;
  authModalOpen: boolean;
  authModalView: 'login' | 'signup' | 'forgot-password' | 'otp';
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toasts: [],
    recentlyViewed: JSON.parse(localStorage.getItem('catchy_recently') || '[]'),
    cookieConsent: localStorage.getItem('catchy_cookies') === 'true',
    searchOpen: false,
    authModalOpen: false,
    authModalView: 'login',
  } as UIState,
  reducers: {
    showToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = Date.now().toString();
      state.toasts.push({ ...action.payload, id });
      if (state.toasts.length > 3) state.toasts.shift();
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    addRecentlyViewed: (state, action: PayloadAction<string>) => {
      state.recentlyViewed = [action.payload, ...state.recentlyViewed.filter(id => id !== action.payload)].slice(0, 20);
      localStorage.setItem('catchy_recently', JSON.stringify(state.recentlyViewed));
    },
    acceptCookies: (state) => { state.cookieConsent = true; localStorage.setItem('catchy_cookies', 'true'); },
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen; },
    openAuthModal: (state, action: PayloadAction<'login' | 'signup' | 'forgot-password' | 'otp' | undefined>) => {
      state.authModalOpen = true;
      if (action.payload) state.authModalView = action.payload;
    },
    closeAuthModal: (state) => {
      state.authModalOpen = false;
    },
  }
});

export const { showToast, removeToast, addRecentlyViewed, acceptCookies, toggleSearch, openAuthModal, closeAuthModal } = uiSlice.actions;
export default uiSlice.reducer;
