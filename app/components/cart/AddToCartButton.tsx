"use client";

import { useEffect, useState } from "react";
import { BagIcon } from "@/app/components/icons";
import { useCartActions } from "@/app/components/cart/useCartActions";

// "Thêm vào giỏ hàng" over the bottom of a ProductCard image: adds 1 to the cart (saved on the backend)
// and shows "Đã thêm vào giỏ hàng." for a moment. Logged out → useCartActions goes to /login.
// From md: a dark bar that slides up when the card is hovered or focused.
// Below md (no hover on touch): a round bag button in the bottom-right corner, like the heart.
export default function AddToCartButton({ productId, productTitle }: { productId: number; productTitle: string }) {
  const { add } = useCartActions();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<"added" | "error" | null>(null);

  // Hide "Đã thêm vào giỏ hàng." after 2 seconds.
  useEffect(() => {
    if (message !== "added") return;
    const timer = setTimeout(() => setMessage(null), 2000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleClick = async () => {
    setBusy(true);
    setMessage(null);
    const ok = await add(productId, 1);
    setBusy(false);
    if (ok) setMessage("added");
    // Without a token the user is already on the way to /login: no error message.
    else if (localStorage.getItem("token")) setMessage("error");
  };

  return (
    // Same box as the card image (aspect-[3/4], top of the card). It lets clicks through to the image link;
    // only the button catches them.
    <div className="pointer-events-none absolute inset-x-0 top-0 flex aspect-[3/4] flex-col items-end justify-end gap-2 p-2">
      {message === "added" && (
        <p role="status" className="bg-white/95 px-2 py-1 text-xs font-medium text-success shadow">
          Đã thêm vào giỏ hàng.
        </p>
      )}
      {message === "error" && (
        <p role="alert" className="bg-white/95 px-2 py-1 text-xs text-sale shadow">
          Không thể thêm vào giỏ hàng.
        </p>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-label={`Thêm ${productTitle} vào giỏ hàng`}
        className="pointer-events-auto flex h-9 w-9 items-center justify-center gap-2 rounded-full bg-white/90 text-foreground shadow transition duration-200 hover:bg-white disabled:opacity-60 md:h-10 md:w-full md:translate-y-2 md:rounded-none md:bg-foreground/90 md:text-background md:opacity-0 md:shadow-none md:backdrop-blur-sm md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:hover:bg-foreground"
      >
        <BagIcon size={18} />
        <span className="hidden text-sm font-semibold md:inline">{busy ? "Đang thêm..." : "Thêm vào giỏ hàng"}</span>
      </button>
    </div>
  );
}
