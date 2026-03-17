import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistItem {
  productId: string;
  title: string;
  price: number;
  image?: string;
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('wishlist') || '[]') : [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.find(item => item.productId === action.payload.productId);
      if (!exists) {
        state.items.push(action.payload);
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    },
    initializeWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    }
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, initializeWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
