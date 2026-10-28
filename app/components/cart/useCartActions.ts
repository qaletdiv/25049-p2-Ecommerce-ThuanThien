"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/store/store";
import { addToCart, clearCart, removeFromCart, updateCartQuantity } from "@/app/store/cartSlice";

// Giá trị mà dispatch(someThunk(...)) trả về: action fulfilled hoặc rejected.
type ThunkResult = { meta: { requestStatus: "fulfilled" | "rejected" }; payload?: unknown };

// Các thao tác giỏ hàng cho component. Mỗi hàm trả về true khi thành công.
// Chưa đăng nhập (hoặc token hết hạn) → chuyển tới /login và trả về false.
export function useCartActions() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const run = async (request: Promise<ThunkResult>) => {
    const result = await request;
    if (result.meta.requestStatus === "fulfilled") return true;
    if (result.payload === "unauthorized") router.push("/login");
    return false;
  };

  return {
    add: (productId: number, quantity = 1) => run(dispatch(addToCart({ productId, quantity }))),
    update: (productId: number, quantity: number) =>
      run(dispatch(updateCartQuantity({ productId, quantity }))),
    remove: (productId: number) => run(dispatch(removeFromCart(productId))),
    clear: () => run(dispatch(clearCart())),
  };
}
