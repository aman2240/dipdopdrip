import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Utility to get a fresh, valid token
const getAuthHeader = () => {
  const token = localStorage.getItem("userToken");
  if (!token || token === "null" || token === "undefined") return null;
  return {
    Authorization: `Bearer ${token}`,
  };
};

// 1. Fetch all orders
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    const headers = getAuthHeader();
    if (!headers) return rejectWithValue({ message: "User not authenticated" });

    try {
      const response = await axios.get(`${API_URL}/api/admin/orders`, {
        headers,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch orders" });
    }
  }
);

// 2. Update order status
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    const headers = getAuthHeader();
    if (!headers) return rejectWithValue({ message: "User not authenticated" });

    try {
      const response = await axios.put(
        `${API_URL}/api/admin/orders/${id}`,
        { status },
        {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// 3. Delete an order
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id, { rejectWithValue }) => {
    const headers = getAuthHeader();
    if (!headers) return rejectWithValue({ message: "User not authenticated" });

    try {
      await axios.delete(`${API_URL}/api/admin/orders/${id}`, {
        headers,
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to delete order" });
    }
  }
);

// Slice
const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        state.totalSales = action.payload.reduce(
          (acc, order) => acc + (order.totalPrice || 0),
          0
        );
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const index = state.orders.findIndex((o) => o._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o._id !== action.payload);
      });
  },
});

export default adminOrderSlice.reducer;
