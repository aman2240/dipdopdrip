import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Helper to get safe Authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem("userToken");
  if (!token || token === "null" || token === "undefined") return null;
  return { Authorization: `Bearer ${token}` };
};

// Fetch all users (admin only)
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, { rejectWithValue }) => {
  const headers = getAuthHeader();
  if (!headers) return rejectWithValue("User not authenticated");

  try {
    const response = await axios.get(`${API_URL}/api/admin/users`, { headers });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
  }
});

// Add a new user
export const addUser = createAsyncThunk("admin/addUser", async (userData, { rejectWithValue }) => {
  const headers = getAuthHeader();
  if (!headers) return rejectWithValue("User not authenticated");

  try {
    const response = await axios.post(`${API_URL}/api/admin/users`, userData, { headers });
    return response.data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to add user");
  }
});

// Update user
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, name, email, role }, { rejectWithValue }) => {
    const headers = getAuthHeader();
    if (!headers) return rejectWithValue("User not authenticated");

    try {
      const response = await axios.put(
        `${API_URL}/api/admin/users/${id}`,
        { name, email, role },
        { headers }
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user");
    }
  }
);

// Delete a user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id, { rejectWithValue }) => {
  const headers = getAuthHeader();
  if (!headers) return rejectWithValue("User not authenticated");

  try {
    await axios.delete(`${API_URL}/api/admin/users/${id}`, { headers });
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete user");
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex((user) => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })

      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      });
  },
});

export default adminSlice.reducer;
