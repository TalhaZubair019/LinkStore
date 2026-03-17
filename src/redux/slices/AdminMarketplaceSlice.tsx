import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Store {
  _id: string;
  name: string;
  isActive: boolean;
  stripeAccountId?: string;
}

interface Vendor {
  _id: string;
  name: string;
  email: string;
  store: Store | null;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  storeId: string;
}

interface AdminState {
  vendors: Vendor[];
  pendingProducts: Product[];
  stats: {
    totalGMV: number;
    platformRevenue: number;
    users: number;
    vendors: number;
    products: number;
    pendingProductsCount: number;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  vendors: [],
  pendingProducts: [],
  stats: null,
  loading: false,
  error: null,
};

const API_URL = 'http://localhost:5000/api/admin';

export const fetchAdminVendors = createAsyncThunk(
  'admin/fetchVendors',
  async (token: string) => {
    const response = await axios.get(`${API_URL}/vendors`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

export const fetchMarketplaceStats = createAsyncThunk(
  'admin/fetchStats',
  async (token: string) => {
    const response = await axios.get(`${API_URL}/marketplace-stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

export const updateVendorStatus = createAsyncThunk(
  'admin/updateVendorStatus',
  async ({ id, isActive, token }: { id: string, isActive: boolean, token: string }) => {
    const response = await axios.put(`${API_URL}/vendors/${id}/status`, { isActive }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { id, isActive: response.data.isActive };
  }
);

export const updateProductStatus = createAsyncThunk(
  'admin/updateProductStatus',
  async ({ id, status, token }: { id: string, status: string, token: string }) => {
    await axios.put(`${API_URL}/products/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { id, status };
  }
);

const adminMarketplaceSlice = createSlice({
  name: 'adminMarketplace',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminVendors.pending, (state) => { state.loading = true; })
      .addCase(fetchAdminVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchMarketplaceStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(updateVendorStatus.fulfilled, (state, action) => {
        const vendor = state.vendors.find(v => v._id === action.payload.id);
        if (vendor && vendor.store) {
          vendor.store.isActive = action.payload.isActive;
        }
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        state.pendingProducts = state.pendingProducts.filter(p => p._id !== action.payload.id);
      });
  },
});

export default adminMarketplaceSlice.reducer;
