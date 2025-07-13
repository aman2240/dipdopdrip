import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helpers
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Fetch cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/cart`, {
        params: { userId, guestId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, size, color, sku, guestId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/cart`, {
        productId,
        quantity,
        size,
        color,
        sku,
        guestId,
        userId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
    }
  }
);

// Update quantity
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ productId, quantity, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/cart`, {
        productId,
        quantity,
        guestId,
        userId,
        size,
        color,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update item");
    }
  }
);

// Remove item
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/api/cart`, {
        data: { productId, guestId, userId, size, color },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove item");
    }
  }
);

// Merge cart
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId, user }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/cart/merge`,
        { guestId, user },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to merge cart");
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    const normalizeCart = (payload) => {
      if (!payload?.products) return payload;

      const normalizedProducts = payload.products.map((p) => ({
        ...p,
        discountPrice: typeof p.discountPrice === "number" ? p.discountPrice : p.price,
      }));

      return {
        ...payload,
        products: normalizedProducts,
      };
    };

    const fulfilledReducer = (state, action) => {
      state.loading = false;
      const normalizedCart = normalizeCart(action.payload);
      state.cart = normalizedCart;
      saveCartToStorage(normalizedCart);
    };

    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, fulfilledReducer)
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, fulfilledReducer)
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add to cart";
      })

      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, fulfilledReducer)
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update quantity";
      })

      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, fulfilledReducer)
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove item";
      })

      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, fulfilledReducer)
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to merge cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;

// Optional selectors
export const selectCart = (state) => state.cart.cart;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

export default cartSlice.reducer;
