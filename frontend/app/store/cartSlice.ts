import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";

// Một dòng của giỏ hàng, giống cách lưu trên backend (users.json → user.cart).
export type CartItem = { productId: number; quantity: number };

// Lý do thunk thất bại: không có token / token hết hạn, hoặc lỗi khác (backend sập, dữ liệu sai...).
export type CartError = "unauthorized" | "failed";

type CartState = {
  items: CartItem[];
  // "loading" chỉ cho lần tải đầu, để khi chuyển trang không bị nháy "Đang tải...".
  status: "idle" | "loading" | "ready" | "failed";
  error: string | null;
};

const initialState: CartState = { items: [], status: "idle", error: null };

// Thunk có kiểu cho rejectWithValue(CartError).
const createCartThunk = createAsyncThunk.withTypes<{ rejectValue: CartError }>();

// Gửi một request tới /api/cart (qua proxy của Next.js) và trả về giỏ hàng mới.
// Ném CartError khi thất bại.
async function sendCart(method: string, path: string, body?: object): Promise<CartItem[]> {
  const token = localStorage.getItem("token");
  // Giỏ hàng được lưu trong tài khoản nên cần đăng nhập.
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
    // Token hết hạn: đăng xuất ở mọi nơi (header, yêu thích, giỏ hàng đều lắng nghe "logout").
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

// Cộng thêm `quantity` cho sản phẩm (backend cộng vào số lượng đã có trong giỏ).
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

// Các thunk thay đổi giỏ hàng. Mỗi thunk trả về toàn bộ giỏ hàng mới từ backend.
const changeThunks = [addToCart, updateCartQuantity, removeFromCart, clearCart] as const;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Đăng xuất làm trống giỏ hàng trên màn hình (vẫn được lưu trên backend).
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

// Selector
type WithCart = { cart: CartState };
export const selectCart = (state: WithCart) => state.cart;
export const selectCartItems = (state: WithCart) => state.cart.items;
// Tổng số món (số trên header), không phải số loại sản phẩm khác nhau.
export const selectCartCount = (state: WithCart) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
