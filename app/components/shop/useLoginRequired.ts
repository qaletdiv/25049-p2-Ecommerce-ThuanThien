"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// For pages that need an account (/wishlist): no token → go to the login page.
// An expired token is handled by ShopProvider (its next request gets a 401 and logs out).
export function useLoginRequired() {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("token")) router.replace("/login");
  }, [router]);
}
