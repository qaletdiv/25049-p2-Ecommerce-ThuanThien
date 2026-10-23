// Shared layout for /login and /register: a pastel brand panel on the left (desktop only), the form on the right.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-7xl flex-1 md:grid-cols-2">
      <div className="hidden flex-col justify-center bg-hero-bg px-12 py-16 md:flex">
        <p className="text-logo font-extrabold tracking-[0.3em] uppercase">Northline</p>
        <p className="mt-6 max-w-sm text-2xl font-semibold">Mua sắm dễ dàng hơn với tài khoản của bạn.</p>
        <ul className="mt-6 space-y-2 text-sm text-muted">
          <li>✓ Lưu sản phẩm yêu thích</li>
          <li>✓ Theo dõi đơn hàng</li>
          <li>✓ Nhận ưu đãi dành riêng cho thành viên</li>
        </ul>
      </div>

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
