"use client";

import { useState } from "react";
import { HeartIcon } from "@/app/components/icons";
import { useShop } from "@/app/components/shop/ShopProvider";

// Heart button: adds or removes a product from the wishlist. Logged out → goes to /login.
export default function WishlistButton({ productId, className = "" }: { productId: number; className?: string }) {
  const { wishlist, toggleWishlist } = useShop();
  const [busy, setBusy] = useState(false);
  const active = wishlist.includes(productId);

  const handleClick = async () => {
    setBusy(true);
    await toggleWishlist(productId);
    setBusy(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-pressed={active}
      aria-label={active ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white disabled:opacity-60 ${
        active ? "text-accent" : "text-foreground"
      } ${className}`}
    >
      <HeartIcon size={18} className={active ? "fill-current" : ""} />
    </button>
  );
}
