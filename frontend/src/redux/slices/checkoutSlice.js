import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Helper: Auth headers
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

// Async thunk to create checkout
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/checkout`,
        checkoutData,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Unknown error",
      });
    }
  }
);

// Slice
const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    checkoutId: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetCheckout: (state) => {
      state.checkout = null;
      state.checkoutId = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
        state.checkoutId = action.payload?._id || null;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Checkout failed";
      });
  },
});

export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
