"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonClass } from "@/app/components/forms/styles";
import WishlistButton from "@/app/components/shop/WishlistButton";
import QuantityInput from "@/app/components/cart/QuantityInput";
import { useCartActions } from "@/app/components/cart/useCartActions";

const outlineButton =
  "w-full border border-foreground px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface disabled:opacity-50";

// Detail page: quantity, "Thêm vào giỏ", "Mua ngay" and the heart.
// Both cart buttons save to the backend through the Redux thunk; logged out → /login.
export default function ProductActions({ productId }: { productId: number }) {
  const { add } = useCartActions();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<"added" | "error" | null>(null);

  const handleAdd = async (goToCart: boolean) => {
    setBusy(true);
    setMessage(null);
    const ok = await add(productId, quantity);
    setBusy(false);
    // Not logged in: useCartActions already went to /login.
    if (!ok) {
      if (localStorage.getItem("token")) setMessage("error");
      return;
    }
    if (goToCart) router.push("/cart");
    else setMessage("added");
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <QuantityInput value={quantity} onChange={setQuantity} disabled={busy} />
        <WishlistButton productId={productId} className="h-11 w-11 shrink-0 border border-border shadow-none" />
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={() => handleAdd(false)} disabled={busy} className={outlineButton}>
          Thêm vào giỏ
        </button>
        <button type="button" onClick={() => handleAdd(true)} disabled={busy} className={buttonClass}>
          Mua ngay
        </button>
      </div>

      {message === "added" && (
        <p role="status" className="mt-2 text-sm text-success">
          Đã thêm vào giỏ hàng.{" "}
          <Link href="/cart" className="font-semibold underline underline-offset-4">
            Xem giỏ hàng
          </Link>
        </p>
      )}
      {message === "error" && (
        <p role="alert" className="mt-2 text-sm text-sale">
          Không thể thêm vào giỏ hàng. Vui lòng thử lại.
        </p>
      )}
    </div>
  );
}
