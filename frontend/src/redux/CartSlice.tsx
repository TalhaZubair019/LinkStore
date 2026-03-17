"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  totalPrice: number;
}

interface CartState {
  cartItems: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

const initialState: CartState = {
  cartItems: [],
  totalQuantity: 0,
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initializeCart: (state, action: PayloadAction<CartState>) => {
      state.cartItems = action.payload.cartItems;
      state.totalQuantity = action.payload.totalQuantity;
      state.totalAmount = action.payload.totalAmount;
    },
    addToCart: (
      state,
      action: PayloadAction<
        Omit<CartItem, "quantity" | "totalPrice"> & { quantity?: number }
      >,
    ) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id,
      );
      const quantityToAdd = newItem.quantity || 1;
      if (!existingItem) {
        state.cartItems.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          image: newItem.image,
          quantity: quantityToAdd,
          totalPrice: newItem.price * quantityToAdd,
        });
      } else {
        existingItem.quantity += quantityToAdd;
        existingItem.totalPrice += newItem.price * quantityToAdd;
      }
      state.totalQuantity = state.cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
      state.totalAmount = state.cartItems.reduce(
        (acc, item) => acc + item.totalPrice,
        0,
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("cartState", JSON.stringify(state));
      }
    },

    removeFromCart: (state, action: PayloadAction<number | string>) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= existingItem.price;
        }
        state.totalQuantity = state.cartItems.reduce(
          (acc, item) => acc + item.quantity,
          0,
        );
        state.totalAmount = state.cartItems.reduce(
          (acc, item) => acc + item.totalPrice,
          0,
        );
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("cartState", JSON.stringify(state));
      }
    },

    deleteItem: (state, action: PayloadAction<number | string>) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);
      state.totalQuantity = state.cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
      state.totalAmount = state.cartItems.reduce(
        (acc, item) => acc + item.totalPrice,
        0,
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("cartState", JSON.stringify(state));
      }
    },
    syncCart: (state, action: PayloadAction<any[]>) => {
      const activeProducts = action.payload;

      state.cartItems = state.cartItems.filter((item) => {
        const dbProduct = activeProducts.find(
          (p) => String(p.id) === String(item.id),
        );

        if (!dbProduct) return false;

        const dbStock = dbProduct.stockQuantity || 0;
        if (dbStock <= 0) return false;
        if (item.quantity > dbStock) {
          item.quantity = dbStock;
          item.totalPrice = item.price * dbStock;
        }

        return true;
      });

      state.totalQuantity = state.cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
      state.totalAmount = state.cartItems.reduce(
        (acc, item) => acc + item.totalPrice,
        0,
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("cartState", JSON.stringify(state));
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      if (typeof window !== "undefined") {
        localStorage.removeItem("cartState");
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  deleteItem,
  initializeCart,
  syncCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
