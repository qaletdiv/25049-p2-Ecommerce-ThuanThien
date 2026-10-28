import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tin tức",
};

// Bài viết tạm. Backend chưa có API tin tức.
const articles = [
  {
    id: 1,
    title: "Ra mắt bộ sưu tập nước hoa mùa thu",
    date: "2026-10-01",
    excerpt: "Những mùi hương ấm áp, dịu nhẹ dành cho những ngày se lạnh đã có mặt tại Northline.",
  },
  {
    id: 2,
    title: "Mẹo chọn mascara phù hợp với hàng mi của bạn",
    date: "2026-09-20",
    excerpt: "Hàng mi dài, ngắn hay thưa đều có loại mascara phù hợp. Cùng tìm hiểu cách chọn đúng sản phẩm.",
  },
  {
    id: 3,
    title: "Gợi ý bố trí nội thất cho căn hộ nhỏ",
    date: "2026-09-08",
    excerpt: "Vài nguyên tắc đơn giản giúp không gian sống gọn gàng và thoáng đãng hơn.",
  },
  {
    id: 4,
    title: "Chương trình giảm giá cuối tháng",
    date: "2026-08-28",
    excerpt: "Nhiều sản phẩm được giảm giá đến 20%. Số lượng có hạn, nhanh tay đặt hàng nhé!",
  },
];

export default function NewsPage() {
  return (
    <div className="mx-auto w-full max-w-screen-lg px-4 py-12">
      <h1 className="text-3xl font-semibold">Tin tức</h1>
      <p className="mt-3 text-muted">Cập nhật sản phẩm mới, mẹo hay và chương trình khuyến mãi từ Northline.</p>

      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {articles.map((a) => (
          <li key={a.id}>
            <article className="h-full border border-border p-6">
              <time dateTime={a.date} className="text-xs text-muted">
                {new Date(`${a.date}T00:00:00`).toLocaleDateString("vi-VN")}
              </time>
              <h2 className="mt-2 text-lg font-semibold">{a.title}</h2>
              <p className="mt-2 text-sm text-muted">{a.excerpt}</p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
