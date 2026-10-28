import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Các số trang cần hiện: luôn có trang đầu và trang cuối, cộng với trang hiện tại và các trang kề bên.
// Khoảng trống thành "…". Ví dụ trang 6 trên 10: 1 … 5 6 7 … 10
function pageList(page: number, totalPages: number) {
  const pages: (number | "gap")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== "gap") pages.push("gap");
  }
  return pages;
}

const itemClass = "flex h-10 min-w-10 items-center justify-center border px-3 text-sm";

// "« Trước 1 2 3 Sau »" dưới lưới sản phẩm. Là link thường nên số trang nằm trong URL
// (nút quay lại và link chia sẻ đều hoạt động). hrefFor(page) tạo URL cho một trang.
export default function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Phân trang" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={`${itemClass} gap-1 border-border hover:border-foreground`}>
          <ChevronLeft size={16} aria-hidden="true" />
          Trước
        </Link>
      ) : (
        <span aria-disabled="true" className={`${itemClass} gap-1 border-border text-muted opacity-50`}>
          <ChevronLeft size={16} aria-hidden="true" />
          Trước
        </span>
      )}

      {pageList(page, totalPages).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-sm text-muted">
            …
          </span>
        ) : p === page ? (
          <span
            key={p}
            aria-current="page"
            className={`${itemClass} border-foreground bg-foreground font-semibold text-background`}
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            aria-label={`Trang ${p}`}
            className={`${itemClass} border-border hover:border-foreground`}
          >
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={`${itemClass} gap-1 border-border hover:border-foreground`}>
          Sau
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      ) : (
        <span aria-disabled="true" className={`${itemClass} gap-1 border-border text-muted opacity-50`}>
          Sau
          <ChevronRight size={16} aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}
