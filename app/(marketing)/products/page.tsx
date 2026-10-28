"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/app/components/product/ProductCard";
import Pagination from "@/app/components/product/Pagination";
import { categoryLabels, type Product } from "@/data/products";

// Khoảng giá dùng giá bán (sau giảm giá).
const priceRanges = [
  { value: "under-10", label: "Dưới $10", min: 0, max: 10 },
  { value: "10-50", label: "$10 – $50", min: 10, max: 50 },
  { value: "50-100", label: "$50 – $100", min: 50, max: 100 },
  { value: "over-100", label: "Trên $100", min: 100, max: Infinity },
];

// Các kiểu sắp xếp. Giá được so sánh sau giảm giá, giống bộ lọc giá.
const sortOptions = [
  { value: "", label: "Nổi bật" },
  { value: "price-asc", label: "Giá: thấp đến cao" },
  { value: "price-desc", label: "Giá: cao đến thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "discount", label: "Giảm giá nhiều nhất" },
  { value: "name", label: "Tên: A – Z" },
];

// 12 lấp đầy các hàng trong lưới 2, 3 và 4 cột.
const PAGE_SIZE = 12;

const salePriceOf = (p: Product) => p.price * (1 - p.discountPercentage / 100);

const selectClass = "w-full border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // null = mặc định: mở trên desktop, ẩn trên mobile (do CSS quyết định nên không bị nháy khi tải).
  const [filtersOpen, setFiltersOpen] = useState<boolean | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  // Từ khóa tìm kiếm từ thanh tìm kiếm ở header và các bộ lọc đều nằm trong URL:
  // /products?q=...&category=...&price=...&rating=...&sort=...&page=...
  const q = (searchParams.get("q") ?? "").trim();
  const category = searchParams.get("category") ?? "";
  const price = searchParams.get("price") ?? "";
  const rating = searchParams.get("rating") ?? "";
  const sort = searchParams.get("sort") ?? "";

  useEffect(() => {
    // "/api/products" đi qua proxy trong next.config.ts (backend không có CORS).
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Không tải được danh sách sản phẩm");
        return res.json();
      })
      .then(setProducts)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Cập nhật một bộ lọc trong URL và giữ nguyên các bộ lọc khác (và ?q=).
  // Quay về trang 1: số trang cũ có thể không tồn tại trong kết quả mới.
  const setFilter = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    params.delete("page");
    const query = params.toString();
    router.replace(query ? `/products?${query}` : "/products", { scroll: false });
  };

  // Xóa danh mục, giá và đánh giá (và số trang), nhưng giữ từ khóa tìm kiếm và thứ tự sắp xếp.
  const clearFilters = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sort) params.set("sort", sort);
    const query = params.toString();
    router.replace(query ? `/products?${query}` : "/products", { scroll: false });
  };

  const categories = [...new Set(products.map((p) => p.category))];
  const range = priceRanges.find((r) => r.value === price);
  const keyword = q.toLowerCase();

  const results = products.filter((p) => {
    // Tìm kiếm: khớp tên sản phẩm hoặc tên danh mục tiếng Việt, không phân biệt hoa thường.
    if (
      keyword &&
      !p.title.toLowerCase().includes(keyword) &&
      !(categoryLabels[p.category] ?? p.category).toLowerCase().includes(keyword)
    ) {
      return false;
    }
    if (category && p.category !== category) return false;
    if (range) {
      const salePrice = salePriceOf(p);
      if (salePrice < range.min || salePrice >= range.max) return false;
    }
    if (rating && p.rating < Number(rating)) return false;
    return true;
  });

  // filter() đã trả về mảng mới nên sắp xếp trực tiếp trên nó là được.
  if (sort === "price-asc") results.sort((a, b) => salePriceOf(a) - salePriceOf(b));
  else if (sort === "price-desc") results.sort((a, b) => salePriceOf(b) - salePriceOf(a));
  else if (sort === "rating") results.sort((a, b) => b.rating - a.rating);
  else if (sort === "discount") results.sort((a, b) => b.discountPercentage - a.discountPercentage);
  else if (sort === "name") results.sort((a, b) => a.title.localeCompare(b.title));

  const hasFilters = Boolean(category || price || rating);

  // Phân trang: ?page= (là 1 khi thiếu hoặc không hợp lệ), giới hạn trong khoảng 1 đến trang cuối.
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Math.floor(Number(searchParams.get("page")) || 1)), totalPages);
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const first = (page - 1) * PAGE_SIZE + 1;
  const last = (page - 1) * PAGE_SIZE + pageItems.length;

  // URL của một trang khác, giữ nguyên tìm kiếm, bộ lọc và sắp xếp. Trang 1 không có ?page=.
  const pageHref = (n: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (n > 1) params.set("page", String(n));
    else params.delete("page");
    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold">
        {q ? `Kết quả tìm kiếm cho “${q}”` : "Tất cả sản phẩm"}
      </h1>

      {loading && <p className="mt-8 text-muted">Đang tải sản phẩm...</p>}
      {error && <p role="alert" className="mt-8 text-accent">{error}</p>}

      {!loading && !error && (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              aria-expanded={filtersOpen ?? undefined}
              aria-controls="filters"
              onClick={() =>
                setFiltersOpen((v) => (v === null ? !window.matchMedia("(min-width: 768px)").matches : !v))
              }
              className="border border-border px-3 py-1.5 text-sm hover:border-foreground"
            >
              {filtersOpen === null ? (
                <>
                  <span className="md:hidden">Hiện bộ lọc</span>
                  <span className="hidden md:inline">Ẩn bộ lọc</span>
                </>
              ) : filtersOpen ? (
                "Ẩn bộ lọc"
              ) : (
                "Hiện bộ lọc"
              )}
            </button>
            <p className="text-sm text-muted">
              {totalPages > 1 ? `Hiển thị ${first}–${last} trong ${results.length} sản phẩm` : `${results.length} sản phẩm`}
              {q && (
                <>
                  {" · "}
                  <Link href="/products" className="text-foreground underline underline-offset-4">
                    Xóa tìm kiếm
                  </Link>
                </>
              )}
            </p>
            <div className="ml-auto flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-muted">Sắp xếp</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setFilter("sort", e.target.value)}
                className="border border-border bg-background px-3 py-1.5 text-sm focus:border-foreground focus:outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sidebar bộ lọc bên trái (nằm trên danh sách sản phẩm ở mobile), sản phẩm bên phải. */}
          <div className="mt-6 flex flex-col gap-8 md:flex-row">
            <div className="min-w-0 flex-1">
              {results.length === 0 && (
                <p className="text-muted">Không tìm thấy sản phẩm nào phù hợp.</p>
              )}
              <div
                className={`grid grid-cols-2 gap-x-4 gap-y-8 ${filtersOpen === false ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
              >
                {pageItems.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              <Pagination page={page} totalPages={totalPages} hrefFor={pageHref} />
            </div>

            <aside
                id="filters"
                aria-label="Bộ lọc"
                className={`order-first space-y-5 border border-border p-4 md:w-60 md:shrink-0 md:self-start ${
                  filtersOpen === null ? "hidden md:block" : filtersOpen ? "block" : "hidden"
                }`}
              >
                <h2 className="font-semibold">Bộ lọc</h2>

                <div>
                  <label htmlFor="filter-category" className="block text-sm font-medium">Danh mục</label>
                  <select
                    id="filter-category"
                    value={category}
                    onChange={(e) => setFilter("category", e.target.value)}
                    className={`mt-1 ${selectClass}`}
                  >
                    <option value="">Tất cả</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {categoryLabels[c] ?? c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="filter-price" className="block text-sm font-medium">Khoảng giá</label>
                  <select
                    id="filter-price"
                    value={price}
                    onChange={(e) => setFilter("price", e.target.value)}
                    className={`mt-1 ${selectClass}`}
                  >
                    <option value="">Tất cả</option>
                    {priceRanges.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="filter-rating" className="block text-sm font-medium">Đánh giá</label>
                  <select
                    id="filter-rating"
                    value={rating}
                    onChange={(e) => setFilter("rating", e.target.value)}
                    className={`mt-1 ${selectClass}`}
                  >
                    <option value="">Tất cả</option>
                    <option value="4">Từ 4★ trở lên</option>
                    <option value="3">Từ 3★ trở lên</option>
                    <option value="2">Từ 2★ trở lên</option>
                  </select>
                </div>

                {hasFilters && (
                  <button type="button" onClick={clearFilters} className="text-sm underline underline-offset-4">
                    Xóa bộ lọc
                  </button>
                )}
              </aside>
          </div>
        </>
      )}
    </div>
  );
}
