import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';

interface WishlistState { items: Product[]; }

const loadWishlist = (): Product[] => {
  try { return JSON.parse(localStorage.getItem('catchy_wishlist') || '[]'); } catch { return []; }
};
const saveWishlist = (items: Product[]) => { localStorage.setItem('catchy_wishlist', JSON.stringify(items)); };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: loadWishlist() } as WishlistState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const idx = state.items.findIndex(i => i._id === action.payload._id);
      if (idx >= 0) state.items.splice(idx, 1);
      else state.items.push(action.payload);
      saveWishlist(state.items);
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i._id !== action.payload);
      saveWishlist(state.items);
    },
    clearWishlist: (state) => { state.items = []; saveWishlist([]); },
  }
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
