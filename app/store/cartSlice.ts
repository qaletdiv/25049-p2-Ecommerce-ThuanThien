import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";

// One line of the cart, as stored on the backend (users.json → user.cart).
export type CartItem = { productId: number; quantity: number };

// Why a thunk failed: no token / expired token, or any other error (backend down, bad input...).
export type CartError = "unauthorized" | "failed";

type CartState = {
  items: CartItem[];
  // "loading" only for the first load, so moving between pages does not flash "Đang tải...".
  status: "idle" | "loading" | "ready" | "failed";
  error: string | null;
};

const initialState: CartState = { items: [], status: "idle", error: null };

// Thunks with typed rejectWithValue(CartError).
const createCartThunk = createAsyncThunk.withTypes<{ rejectValue: CartError }>();

// Send one request to /api/cart (through the Next.js proxy) and return the new cart.
// Throws a CartError when it fails.
async function sendCart(method: string, path: string, body?: object): Promise<CartItem[]> {
  const token = localStorage.getItem("token");
  // The cart is saved in the account, so it needs a login.
  if (!token) throw "unauthorized";

  let res: Response;
  try {
    res = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw "failed";
  }
  if (res.status === 401) {
    // Token expired: log out everywhere (header, wishlist, cart all listen for "logout").
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("logout"));
    throw "unauthorized";
  }
  if (!res.ok) throw "failed";
  const data: { cart: CartItem[] } = await res.json();
  return data.cart;
}

export const fetchCart = createCartThunk("cart/fetch", async (_: void, { rejectWithValue }) => {
  try {
    return await sendCart("GET", "/api/cart");
  } catch (err) {
    return rejectWithValue(err as CartError);
  }
});

// Adds `quantity` to the product (the backend adds it to what is already in the cart).
export const addToCart = createCartThunk(
  "cart/add",
  async ({ productId, quantity }: CartItem, { rejectWithValue }) => {
    try {
      return await sendCart("POST", "/api/cart", { productId, quantity });
    } catch (err) {
      return rejectWithValue(err as CartError);
    }
  },
);

export const updateCartQuantity = createCartThunk(
  "cart/update",
  async ({ productId, quantity }: CartItem, { rejectWithValue }) => {
    try {
      return await sendCart("PUT", `/api/cart/${productId}`, { quantity });
    } catch (err) {
      return rejectWithValue(err as CartError);
    }
  },
);

export const removeFromCart = createCartThunk(
  "cart/remove",
  async (productId: number, { rejectWithValue }) => {
    try {
      return await sendCart("DELETE", `/api/cart/${productId}`);
    } catch (err) {
      return rejectWithValue(err as CartError);
    }
  },
);

export const clearCart = createCartThunk("cart/clear", async (_: void, { rejectWithValue }) => {
  try {
    return await sendCart("DELETE", "/api/cart");
  } catch (err) {
    return rejectWithValue(err as CartError);
  }
});

// The thunks that change the cart. Each answers with the whole new cart from the backend.
const changeThunks = [addToCart, updateCartQuantity, removeFromCart, clearCart] as const;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Logging out empties the cart on screen (it stays saved on the backend).
    cartCleared: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        if (state.status === "idle") state.status = "loading";
      })
      .addCase(fetchCart.rejected, (state, action) => {
        if (action.payload === "unauthorized") return initialState;
        state.status = "failed";
        state.error = "Không thể tải giỏ hàng. Vui lòng thử lại.";
      })
      .addMatcher(isAnyOf(...changeThunks.map((t) => t.pending)), (state) => {
        state.error = null;
      })
      .addMatcher(isAnyOf(...changeThunks.map((t) => t.rejected)), (state, action) => {
        if (action.payload === "unauthorized") return initialState;
        state.error = "Không thể cập nhật giỏ hàng. Vui lòng thử lại.";
      })
      .addMatcher(
        isAnyOf(fetchCart.fulfilled, ...changeThunks.map((t) => t.fulfilled)),
        (state, action) => {
          state.items = action.payload;
          state.status = "ready";
          state.error = null;
        },
      );
  },
});

export const { cartCleared } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
type WithCart = { cart: CartState };
export const selectCart = (state: WithCart) => state.cart;
export const selectCartItems = (state: WithCart) => state.cart.items;
// Total number of pieces (the header badge), not the number of different products.
export const selectCartCount = (state: WithCart) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
