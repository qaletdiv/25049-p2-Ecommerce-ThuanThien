"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Only the wishlist. The cart lives in the Redux store (app/store/cartSlice.ts).
type ShopData = { wishlist: number[] };

type Shop = ShopData & {
  // Each action returns true when it worked. Without a login it goes to /login and returns false.
  toggleWishlist: (productId: number) => Promise<boolean>;
};

const ShopContext = createContext<Shop | null>(null);

const empty: ShopData = { wishlist: [] };

// Wishlist of the logged-in user, stored on the backend (/api/shop).
// Shared by the header count, the heart buttons and the wishlist and profile pages.
export default function ShopProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ShopData>(empty);
  const pathname = usePathname();
  const router = useRouter();

  // Load again on every page change, like the header does for the user.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/shop", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : empty))
      .then(setData)
      .catch(() => setData(empty));
  }, [pathname]);

  // Logging out (header, profile page, or token expiry) sends a "logout" event.
  useEffect(() => {
    const onLogout = () => setData(empty);
    window.addEventListener("logout", onLogout);
    return () => window.removeEventListener("logout", onLogout);
  }, []);

  // Send one change to the backend; the answer is the new { wishlist }.
  const send = async (path: string, body: object) => {
    const token = localStorage.getItem("token");
    // The wishlist needs an account.
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
        // Token expired: log out and go to the login page.
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
