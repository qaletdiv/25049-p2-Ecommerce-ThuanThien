"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";
import { makeStore, useAppDispatch } from "@/app/store/store";
import { cartCleared, fetchCart } from "@/app/store/cartSlice";

// Redux store cho toàn app (hiện chỉ có giỏ hàng). Bọc mọi thứ trong app/layout.tsx.
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // useState(makeStore) chỉ chạy makeStore một lần, nên store được giữ qua các lần re-render.
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      <CartSync />
      {children}
    </Provider>
  );
}

// Đồng bộ giỏ hàng trong store với backend, giống cách ShopProvider làm với danh sách yêu thích.
function CartSync() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  // Tải lại mỗi khi đổi trang (để giỏ hàng hiện ngay sau khi đăng nhập).
  useEffect(() => {
    if (localStorage.getItem("token")) dispatch(fetchCart());
  }, [pathname, dispatch]);

  // Đăng xuất (từ header, trang hồ sơ, hoặc token hết hạn) sẽ gửi sự kiện "logout".
  useEffect(() => {
    const onLogout = () => dispatch(cartCleared());
    window.addEventListener("logout", onLogout);
    return () => window.removeEventListener("logout", onLogout);
  }, [dispatch]);

  return null;
}
