import Link from "next/link";
import { notFound } from "next/navigation";
import type { Product } from "@/data/products";

async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:5000/api/products");
  if (!res.ok) throw new Error("Không tải được danh sách sản phẩm");
  return res.json();
}

// Render sẵn một trang đánh giá cho mỗi sản phẩm lúc build.
export async function generateStaticParams() {
  const products = await getProducts();
  // Tham số route là chuỗi; id ở backend là số.
  return products.map((p) => ({ id: String(p.id) }));
}

export default async function ProductReviewsPage({ params }: PageProps<"/products/[id]/reviews">) {
  const { id } = await params;
  // Backend không có /api/products/:id nên tìm trong danh sách đầy đủ.
  const products = await getProducts();
  const product = products.find((p) => String(p.id) === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link href={`/products/${product.id}`} className="text-sm text-muted underline underline-offset-4">
        Quay lại sản phẩm
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">Đánh giá: {product.title}</h1>
      <p className="mt-2 text-sm text-muted">
        ★ {product.rating.toFixed(1)} · {product.reviews.length} đánh giá
      </p>

      {product.reviews.length === 0 && <p className="mt-8 text-muted">Chưa có đánh giá nào.</p>}

      <ul className="mt-6 border-t border-border">
        {product.reviews.map((r, i) => (
          <li key={i} className="border-b border-border py-4">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm font-semibold">{r.reviewerName}</p>
              <p className="text-xs text-muted">{new Date(r.date).toLocaleDateString("vi-VN")}</p>
            </div>
            <p className="mt-1 text-sm text-accent" aria-label={`${r.rating} trên 5 sao`}>
              {"★".repeat(r.rating)}
              <span className="text-border">{"★".repeat(5 - r.rating)}</span>
            </p>
            <p className="mt-1 text-sm text-muted">{r.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
