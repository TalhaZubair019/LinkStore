import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  stateCode?: string;
  province?: string;
  postcode?: string;
  cart?: any[];
  wishlist?: any[];
  isAdmin?: boolean;
  adminRole?: "super_admin" | "admin" | null;
  promotionPending?: boolean;
  demotionPending?: boolean;
  vendorApprovalPending?: boolean;
  isVendor?: boolean;
  vendorProfile?: {
    storeName: string;
    storeSlug: string;
    storeDescription?: string;
    logo?: string;
    banner?: string;
    status: "pending" | "approved" | "suspended";
    stripeAccountId?: string | null;
    stripeOnboardingComplete?: boolean;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setAuthLoaded: (state) => {
      state.isLoading = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { loginSuccess, logout, updateUser, setAuthLoaded } =
  authSlice.actions;
export default authSlice.reducer;
