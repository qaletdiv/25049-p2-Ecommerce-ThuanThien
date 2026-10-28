"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Chỉ có danh sách yêu thích. Giỏ hàng nằm trong Redux store (app/store/cartSlice.ts).
type ShopData = { wishlist: number[] };

type Shop = ShopData & {
  // Mỗi thao tác trả về true khi thành công. Chưa đăng nhập thì chuyển tới /login và trả về false.
  toggleWishlist: (productId: number) => Promise<boolean>;
};

const ShopContext = createContext<Shop | null>(null);

const empty: ShopData = { wishlist: [] };

// Danh sách yêu thích của người dùng đã đăng nhập, lưu trên backend (/api/shop).
// Dùng chung cho số đếm trên header, các nút trái tim, trang yêu thích và trang hồ sơ.
export default function ShopProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ShopData>(empty);
  const pathname = usePathname();
  const router = useRouter();

  // Tải lại mỗi khi đổi trang, giống header làm với người dùng.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/shop", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : empty))
      .then(setData)
      .catch(() => setData(empty));
  }, [pathname]);

  // Đăng xuất (từ header, trang hồ sơ, hoặc token hết hạn) sẽ gửi sự kiện "logout".
  useEffect(() => {
    const onLogout = () => setData(empty);
    window.addEventListener("logout", onLogout);
    return () => window.removeEventListener("logout", onLogout);
  }, []);

  // Gửi một thay đổi lên backend; phản hồi là { wishlist } mới.
  const send = async (path: string, body: object) => {
    const token = localStorage.getItem("token");
    // Danh sách yêu thích cần có tài khoản.
    if (!token) {
      router.push("/login");
      return false;
    }
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        // Token hết hạn: đăng xuất và chuyển tới trang đăng nhập.
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("logout"));
        router.push("/login");
        return false;
      }
      if (!res.ok) return false;
      setData(await res.json());
      return true;
    } catch {
      return false;
    }
  };

  const shop: Shop = {
    ...data,
    toggleWishlist: (productId) => send("/api/shop/wishlist", { productId }),
  };

  return <ShopContext.Provider value={shop}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const shop = useContext(ShopContext);
  if (!shop) throw new Error("useShop must be used inside <ShopProvider>");
  return shop;
}
