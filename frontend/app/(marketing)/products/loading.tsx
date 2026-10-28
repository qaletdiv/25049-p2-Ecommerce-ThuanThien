// Suspense fallback cho /products (cần vì trang đọc ?q= bằng useSearchParams).
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <p className="text-muted">Đang tải sản phẩm...</p>
    </div>
  );
}
