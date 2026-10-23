"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/store/store";
import { addToCart, clearCart, removeFromCart, updateCartQuantity } from "@/app/store/cartSlice";

// What dispatch(someThunk(...)) resolves to: the fulfilled or rejected action.
type ThunkResult = { meta: { requestStatus: "fulfilled" | "rejected" }; payload?: unknown };

// Cart actions for components. Each returns true when it worked.
// Not logged in (or the token expired) → goes to /login and returns false.
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
