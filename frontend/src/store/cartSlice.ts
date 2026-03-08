import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color?: string;
  id: string;
}

interface CartState {
  items: CartItem[];
  coupon: { code: string; discount: number } | null;
}

const loadCart = (): CartItem[] => {
  try { return JSON.parse(localStorage.getItem('catchy_cart') || '[]'); } catch { return []; }
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem('catchy_cart', JSON.stringify(items));
};

const initialState: CartState = { items: loadCart(), coupon: null };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; size: string; color?: string; quantity?: number }>) => {
      const { product, size, color, quantity = 1 } = action.payload;
      const id = `${product._id}_${size}_${color || ''}`;
      const existing = state.items.find(i => i.id === id);
      if (existing) { existing.quantity += quantity; }
      else { state.items.push({ product, quantity, size, color, id }); }
      saveCart(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      saveCart(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) { item.quantity = Math.max(1, action.payload.quantity); }
      saveCart(state.items);
    },
    updateSize: (state, action: PayloadAction<{ id: string; newSize: string }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        const newId = `${item.product._id}_${action.payload.newSize}_${item.color || ''}`;
        item.size = action.payload.newSize;
        item.id = newId;
      }
      saveCart(state.items);
    },
    applyCoupon: (state, action: PayloadAction<{ code: string; discount: number }>) => {
      state.coupon = action.payload;
    },
    removeCoupon: (state) => { state.coupon = null; },
    clearCart: (state) => { state.items = []; state.coupon = null; saveCart([]); },
  }
});

export const { addToCart, removeFromCart, updateQuantity, updateSize, applyCoupon, removeCoupon, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
