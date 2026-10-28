"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { saveLastPage } from "@/app/components/auth/lastPage";

// Lưu trang hiện tại (path + query) vào localStorage mỗi khi URL thay đổi.
// Mọi cách đi tới /login (link trên header, chuyển hướng "cần đăng nhập", token hết hạn...)
// đều thấy trang trước đã được lưu sẵn, và trang đăng nhập có thể quay lại đó.
// Được render trong app/layout.tsx bên trong <Suspense> riêng, vì useSearchParams cần nó.
export default function LastPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    saveLastPage(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}
