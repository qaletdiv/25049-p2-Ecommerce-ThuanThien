"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Cho các trang cần tài khoản (/wishlist): không có token → chuyển tới trang đăng nhập.
// Token hết hạn do ShopProvider xử lý (request tiếp theo nhận 401 và đăng xuất).
export function useLoginRequired() {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("token")) router.replace("/login");
  }, [router]);
}
