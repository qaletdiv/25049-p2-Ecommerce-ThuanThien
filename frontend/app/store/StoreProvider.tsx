"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";
import { makeStore, useAppDispatch } from "@/app/store/store";
import { cartCleared, fetchCart } from "@/app/store/cartSlice";

// Redux store for the whole app (today only the cart). Wraps everything in app/layout.tsx.
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // useState(makeStore) runs makeStore once, so the store survives re-renders.
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      <CartSync />
      {children}
    </Provider>
  );
}

// Keeps the cart in the store in sync with the backend, the same way ShopProvider does for the wishlist.
function CartSync() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  // Load again on every page change (so the cart appears right after logging in).
  useEffect(() => {
    if (localStorage.getItem("token")) dispatch(fetchCart());
  }, [pathname, dispatch]);

  // Logging out (header, profile page, or token expiry) sends a "logout" event.
  useEffect(() => {
    const onLogout = () => dispatch(cartCleared());
    window.addEventListener("logout", onLogout);
    return () => window.removeEventListener("logout", onLogout);
  }, [dispatch]);

  return null;
}
