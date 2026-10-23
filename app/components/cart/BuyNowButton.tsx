"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BagIcon } from "@/app/components/icons";
import { useCartActions } from "@/app/components/cart/useCartActions";

// "Mua ngay" over the bottom of a ProductCard image: adds 1 to the cart (saved on the backend),
// then goes to /cart. Logged out → useCartActions goes to /login.
// From md: a dark bar that slides up when the card is hovered or focused.
// Below md (no hover on touch): a round bag button in the bottom-right corner, like the heart.
export default function BuyNowButton({ productId, productTitle }: { productId: number; productTitle: string }) {
  const { add } = useCartActions();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleClick = async () => {
    setBusy(true);
    setFailed(false);
    const ok = await add(productId, 1);
    if (ok) {
      router.push("/cart");
      return;
    }
    setBusy(false);
    // Without a token the user is already on the way to /login: no error message.
    if (localStorage.getItem("token")) setFailed(true);
  };

  return (
    // Same box as the card image (aspect-[3/4], top of the card). It lets clicks through to the image link;
    // only the button catches them.
    <div className="pointer-events-none absolute inset-x-0 top-0 flex aspect-[3/4] flex-col items-end justify-end gap-2 p-2">
      {failed && (
        <p role="alert" className="bg-white/95 px-2 py-1 text-xs text-sale shadow">
          Không thể thêm vào giỏ hàng.
        </p>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-label={`Mua ngay ${productTitle}`}
        className="pointer-events-auto flex h-9 w-9 items-center justify-center gap-2 rounded-full bg-white/90 text-foreground shadow transition duration-200 hover:bg-white disabled:opacity-60 md:h-10 md:w-full md:translate-y-2 md:rounded-none md:bg-foreground/90 md:text-background md:opacity-0 md:shadow-none md:backdrop-blur-sm md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:hover:bg-foreground"
      >
        <BagIcon size={18} />
        <span className="hidden text-sm font-semibold md:inline">{busy ? "Đang thêm..." : "Mua ngay"}</span>
      </button>
    </div>
  );
}
