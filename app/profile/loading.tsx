// Suspense fallback cho /profile (cần vì trang đọc ?tab= bằng useSearchParams).
export default function Loading() {
  return <p className="mx-auto w-full max-w-5xl px-4 py-12 text-muted">Đang tải thông tin tài khoản...</p>;
}
