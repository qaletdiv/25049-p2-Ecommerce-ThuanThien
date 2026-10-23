"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/app/components/product/ProductCard";
import { useShop } from "@/app/components/shop/ShopProvider";
import { useLoginRequired } from "@/app/components/shop/useLoginRequired";
import type { Product } from "@/data/products";

// The products in the wishlist. The heart on each card removes it. Needs a login.
export default function WishlistPage() {
  useLoginRequired();
  const { wishlist } = useShop();
  // The wishlist only stores ids, so fetch the product list to show them.
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : []))
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const items = wishlist
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold">
        Yêu thích <span className="text-base font-normal text-muted">({wishlist.length} sản phẩm)</span>
      </h1>

      {loading ? (
        <p className="mt-8 text-muted">Đang tải...</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-muted">
          Chưa có sản phẩm yêu thích.{" "}
          <Link href="/products" className="text-foreground underline underline-offset-4">
            Xem sản phẩm
          </Link>
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
