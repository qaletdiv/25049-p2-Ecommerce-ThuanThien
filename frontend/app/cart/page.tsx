"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { formatPrice, type Product } from "@/data/products";
import { buttonClass } from "@/app/components/forms/styles";
import QuantityInput from "@/app/components/cart/QuantityInput";
import { useCartActions } from "@/app/components/cart/useCartActions";
import { useLoginRequired } from "@/app/components/shop/useLoginRequired";
import { useAppSelector } from "@/app/store/store";
import { selectCart, selectCartCount } from "@/app/store/cartSlice";
import { FREE_SHIPPING_FROM, orderTotals, salePriceOf } from "@/data/orders";

// The cart of the logged-in user. Items live in the Redux store (saved on the backend);
// every change goes through a thunk and the store gets the new cart from the backend's answer.
export default function CartPage() {
  useLoginRequired();
  const { items, status, error } = useAppSelector(selectCart);
  const count = useAppSelector(selectCartCount);
  const { update, remove, clear } = useCartActions();

  // The cart only stores ids and quantities, so fetch the product list to show them.
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  // Product id being changed (or "all" while clearing), to disable its buttons.
  const [busy, setBusy] = useState<number | "all" | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : []))
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Join each cart line with its product. Lines whose product no longer exists are skipped.
  const lines = items
    .map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) }))
    .filter((line): line is typeof line & { product: Product } => Boolean(line.product));

  const totals = orderTotals(lines);

  const handleQuantity = async (productId: number, quantity: number) => {
    setBusy(productId);
    await update(productId, quantity);
    setBusy(null);
  };

  const handleRemove = async (productId: number) => {
    setBusy(productId);
    await remove(productId);
    setBusy(null);
  };

  const handleClear = async () => {
    if (!window.confirm("Xóa tất cả sản phẩm khỏi giỏ hàng?")) return;
    setBusy("all");
    await clear();
    setBusy(null);
  };

  const loading = loadingProducts || status === "idle" || status === "loading";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold">
        Giỏ hàng <span className="text-base font-normal text-muted">({count} sản phẩm)</span>
      </h1>

      {error && (
        <p role="alert" className="mt-4 text-sm text-sale">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-muted">Đang tải...</p>
      ) : lines.length === 0 ? (
        <p className="mt-8 text-muted">
          Giỏ hàng đang trống.{" "}
          <Link href="/products" className="text-foreground underline underline-offset-4">
            Xem sản phẩm
          </Link>
        </p>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
          <section aria-label="Sản phẩm trong giỏ">
            <ul className="divide-y divide-border border-y border-border">
              {lines.map(({ productId, quantity, product }) => {
                const salePrice = salePriceOf(product);
                const onSale = product.discountPercentage > 0;
                const rowBusy = busy === productId || busy === "all";

                return (
                  <li key={productId} className="flex gap-4 py-4">
                    <Link href={`/products/${productId}`} className="relative h-24 w-20 shrink-0 bg-surface sm:h-32 sm:w-24">
                      <Image src={product.thumbnail} alt={product.title} fill sizes="96px" className="object-cover" />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <Link href={`/products/${productId}`} className="line-clamp-2 text-sm font-medium hover:underline">
                          {product.title}
                        </Link>
                        <p className="mt-1 text-sm">
                          {formatPrice(salePrice)}
                          {onSale && (
                            <>
                              {" "}
                              <span className="text-muted line-through">{formatPrice(product.price)}</span>
                            </>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                        <QuantityInput
                          value={quantity}
                          onChange={(q) => handleQuantity(productId, q)}
                          disabled={rowBusy}
                          label={`Số lượng ${product.title}`}
                        />
                        <p className="text-sm font-semibold">{formatPrice(salePrice * quantity)}</p>
                        <button
                          type="button"
                          onClick={() => handleRemove(productId)}
                          disabled={rowBusy}
                          aria-label={`Xóa ${product.title} khỏi giỏ hàng`}
                          className="ml-auto flex items-center gap-1 text-sm text-muted hover:text-foreground disabled:opacity-50 sm:ml-0"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={handleClear}
              disabled={busy !== null}
              className="mt-4 text-sm text-muted underline-offset-4 hover:text-foreground hover:underline disabled:opacity-50"
            >
              Xóa giỏ hàng
            </button>
          </section>

          <aside aria-labelledby="cart-summary" className="bg-surface p-6">
            <h2 id="cart-summary" className="text-lg font-semibold">Tóm tắt đơn hàng</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Tạm tính</dt>
                <dd>{formatPrice(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted">Giảm giá</dt>
                  <dd className="text-sale">−{formatPrice(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">Phí vận chuyển</dt>
                <dd>{totals.shippingFee === 0 ? "Miễn phí" : formatPrice(totals.shippingFee)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                <dt>Tổng cộng</dt>
                <dd>{formatPrice(totals.total)}</dd>
              </div>
            </dl>

            {totals.shippingFee > 0 && (
              <p className="mt-3 text-sm text-muted">
                Mua thêm {formatPrice(FREE_SHIPPING_FROM - totals.itemsTotal)} để được miễn phí vận chuyển.
              </p>
            )}

            <Link href="/checkout" className={`mt-6 block text-center ${buttonClass}`}>
              Thanh toán
            </Link>
            <Link href="/products" className="mt-4 block text-center text-sm underline underline-offset-4">
              Tiếp tục mua sắm
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
