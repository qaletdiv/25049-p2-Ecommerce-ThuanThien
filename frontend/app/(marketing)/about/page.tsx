import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Giới thiệu",
};

// Placeholder content until the real store information is ready.
const values = [
  {
    title: "Sản phẩm chọn lọc",
    text: "Mỗi sản phẩm đều được chúng tôi kiểm tra về chất lượng và nguồn gốc trước khi lên kệ.",
  },
  {
    title: "Giá minh bạch",
    text: "Giá niêm yết rõ ràng, giảm giá được ghi cụ thể trên từng sản phẩm, không phí ẩn.",
  },
  {
    title: "Hỗ trợ tận tâm",
    text: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng giải đáp mọi thắc mắc của bạn.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-screen-lg px-4 py-12">
      <h1 className="text-3xl font-semibold">Giới thiệu</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Northline là cửa hàng trực tuyến mang đến những sản phẩm làm đẹp, nước hoa, nội thất và thực phẩm
        được chọn lọc kỹ lưỡng. Chúng tôi mong muốn việc mua sắm trở nên đơn giản, đáng tin cậy và thú vị.
      </p>

      <section aria-labelledby="our-story" className="mt-12">
        <h2 id="our-story" className="text-2xl font-semibold">Câu chuyện của chúng tôi</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Bắt đầu từ một cửa hàng nhỏ, Northline dần mở rộng danh mục để phục vụ nhiều nhu cầu hơn trong cuộc
          sống hằng ngày. Dù phát triển đến đâu, chúng tôi vẫn giữ cách làm việc ban đầu: lắng nghe khách hàng
          và chỉ bán những gì mình tin tưởng.
        </p>
      </section>

      <section aria-labelledby="our-values" className="mt-12">
        <h2 id="our-values" className="text-2xl font-semibold">Giá trị cốt lõi</h2>
        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <li key={v.title} className="bg-surface p-6">
              <h3 className="font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted">{v.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link href="/products" className="bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90">
          Xem sản phẩm
        </Link>
        <Link href="/contact" className="border border-foreground px-6 py-3 text-sm font-semibold hover:bg-surface">
          Liên hệ với chúng tôi
        </Link>
      </div>
    </div>
  );
}
