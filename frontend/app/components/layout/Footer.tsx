import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  TikTokIcon,
} from "@/app/components/icons";

// Thông tin cửa hàng tạm (trang liên hệ cũng dùng).
export const store = {
  address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
  phone: "0900 000 000",
  email: "hello@northline.vn",
};

// Chỉ /contact và /login là trang thật; còn lại là tạm.
const infoLinks = [
  { label: "FAQ", href: "#" },
  { label: "Tài khoản", href: "/login" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

const policyLinks = [
  { label: "Vận chuyển", href: "#" },
  { label: "Đổi trả", href: "#" },
  { label: "Bảo mật", href: "#" },
  { label: "Điều khoản dịch vụ", href: "#" },
];

const socials = [
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "TikTok", href: "#", Icon: TikTokIcon },
];

// Nhãn chữ thay cho logo thanh toán thật.
const payments = ["VISA", "Mastercard", "MoMo", "COD"];

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-semibold tracking-wide uppercase">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-muted hover:text-footer-text hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;

  return (
    <footer className="mt-16 bg-footer-bg text-footer-text">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        {/* 1. Thông tin cửa hàng */}
        <div>
          <p className="text-xl font-extrabold tracking-[0.3em] uppercase">Northline</p>
          <address className="mt-4 space-y-2 text-sm not-italic text-muted">
            <p className="flex gap-2">
              <MapPinIcon size={16} className="mt-0.5 shrink-0" />
              <span>{store.address}</span>
            </p>
            <p className="flex gap-2">
              <PhoneIcon size={16} className="mt-0.5 shrink-0" />
              <a href={`tel:${store.phone.replace(/\s/g, "")}`} className="hover:text-footer-text hover:underline">
                {store.phone}
              </a>
            </p>
            <p className="flex gap-2">
              <MailIcon size={16} className="mt-0.5 shrink-0" />
              <a href={`mailto:${store.email}`} className="hover:text-footer-text hover:underline">
                {store.email}
              </a>
            </p>
          </address>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium underline underline-offset-4"
          >
            Chỉ đường
          </a>
          <ul className="mt-5 flex gap-2">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-footer-text"
                >
                  <Icon size={16} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Thông tin */}
        <LinkColumn title="Thông tin" links={infoLinks} />

        {/* 3. Chính sách */}
        <LinkColumn title="Chính sách" links={policyLinks} />

        {/* 4. Đăng ký nhận email */}
        <div>
          <h2 className="text-sm font-semibold tracking-wide uppercase">Đăng ký nhận tin</h2>
          <p className="mt-4 mb-3 text-sm text-muted">
            Nhận thông tin về sản phẩm mới và ưu đãi dành riêng cho bạn.
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Hàng dưới cùng */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <p className="text-xs text-muted">© 2025 Letdiv Copyright</p>
          <ul aria-label="Phương thức thanh toán" className="flex flex-wrap gap-2">
            {payments.map((name) => (
              <li
                key={name}
                className="rounded border border-border bg-background px-2 py-1 text-[0.625rem] font-semibold tracking-wide"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
