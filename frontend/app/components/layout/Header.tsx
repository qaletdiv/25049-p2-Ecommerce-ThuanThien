"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Form from "next/form";
import { usePathname, useRouter } from "next/navigation";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "@/app/components/icons";
import Banner from "@/app/components/layout/Banner";
import { useShop } from "@/app/components/shop/ShopProvider";
import { useAppSelector } from "@/app/store/store";
import { selectCartCount } from "@/app/store/cartSlice";
type User = { id: number; username: string; fullName?: string; email: string };

const iconButton = "relative flex h-10 w-10 items-center justify-center text-foreground hover:opacity-70";
// Link chữ bên phải từ lg: "Đăng nhập" / "Đăng ký" hoặc "Tài khoản của tôi" / "Đăng xuất".
const textLink =
  "hidden px-2 text-sm whitespace-nowrap text-header-link underline-offset-4 hover:text-header-link-hover hover:underline lg:inline";

function Badge({ count }: { count: number }) {
  return (
    <span
      aria-hidden="true"
      className="absolute top-1 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.625rem] font-semibold leading-none text-accent-contrast"
    >
      {count}
    </span>
  );
}

const navItems = [
  { name: "Trang chủ", href: "/" },
  { name: "Sản phẩm", href: "/products" },
  { name: "Giới thiệu", href: "/about" },
  { name: "Tin tức", href: "/news" },
  { name: "Liên hệ", href: "/contact" },
];
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { wishlist } = useShop();
  const wishlistCount = wishlist.length;
  // Tổng số món trong giỏ hàng, lấy từ Redux store (StoreProvider tải từ backend).
  const cartCount = useAppSelector(selectCartCount);

  // Gửi JWT trong localStorage lên backend để biết ai đang đăng nhập.
  // Chạy lại mỗi khi đổi trang, để header cập nhật ngay sau khi đăng nhập hoặc đăng ký.
  useEffect(() => {
    const token = localStorage.getItem("token");
    // Không có token: chưa đăng nhập (user đã là null; đăng xuất cũng xóa nó).
    if (!token) return;

    // Tự động đăng xuất khi token hết hạn (1 giờ sau khi đăng nhập).
    // Phần giữa của JWT là JSON mã hóa base64url, có "exp" tính bằng giây.
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      timer = setTimeout(() => {
        localStorage.removeItem("token");
        setUser(null);
        window.dispatchEvent(new Event("logout"));
        router.push("/login");
      }, payload.exp * 1000 - Date.now());
    } catch {
      // Không phải JWT hợp lệ: /api/auth/me bên dưới sẽ từ chối.
    }

    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        // Token không hợp lệ hoặc hết hạn: bỏ nó đi.
        if (!res.ok) localStorage.removeItem("token");
        return res.ok ? res.json() : { user: null };
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));

    return () => clearTimeout(timer);
  }, [pathname, router]);

  // Các trang khác (ví dụ /profile) đăng xuất bằng cách xóa token và gửi sự kiện "logout".
  useEffect(() => {
    const onLogout = () => setUser(null);
    window.addEventListener("logout", onLogout);
    return () => window.removeEventListener("logout", onLogout);
  }, []);

  // Chào bằng họ tên; tài khoản tạo trước khi có trường tên thì chỉ có username.
  const displayName = user?.fullName || user?.username;

  const handleLogout = () => {
    // Đăng xuất chỉ là bỏ token đi (sự kiện "logout" cũng xóa danh sách yêu thích).
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("logout"));
    setMenuOpen(false);
    router.push("/");
  };

  // Đóng menu mobile và thanh tìm kiếm khi nhấn Escape.
  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, searchOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-header-bg">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 md:h-20">

          {/* Logo */}
          <Link
            href="/"
            className="mr-6 text-logo font-extrabold tracking-[0.3em] text-foreground uppercase"
          >
            Northline
          </Link>

          {/* Nút menu mobile */}
          <button
            type="button"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className={`${iconButton} md:hidden`}
          >
            {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>

          {/* Menu desktop */}
          <nav
            aria-label="Menu chính"
            className="hidden items-center gap-6 md:flex"
          >
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${isActive
                    ? "text-foreground"
                    : "text-header-link hover:text-header-link-hover"
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Icon bên phải */}
          <div className="ml-auto flex items-center justify-end gap-1">
            <button
              type="button"
              aria-label={searchOpen ? "Đóng tìm kiếm" : "Tìm kiếm"}
              aria-expanded={searchOpen}
              aria-controls="header-search"
              onClick={() => setSearchOpen((v) => !v)}
              className={iconButton}
            >
              {searchOpen ? (
                <CloseIcon size={20} />
              ) : (
                <SearchIcon size={20} />
              )}
            </button>

            {user ? (
              <>
                {/* Tên nằm trong tooltip; trang hồ sơ hiện đầy đủ. */}
                <Link href="/profile" title={displayName} className={`${textLink} font-semibold text-foreground`}>
                  Tài khoản của tôi
                </Link>

                {/* Từ sm đến lg link chữ bị ẩn, nên icon tài khoản dẫn tới trang hồ sơ. */}
                <Link
                  href="/profile"
                  aria-label="Tài khoản của tôi"
                  className={`${iconButton} hidden sm:flex lg:hidden`}
                >
                  <UserIcon size={20} />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden px-2 text-sm whitespace-nowrap text-header-link underline-offset-4 hover:text-header-link-hover hover:underline sm:inline"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={`${textLink} font-semibold text-foreground`}>
                  Đăng nhập
                </Link>
                <Link href="/register" className={textLink}>
                  Đăng ký
                </Link>

                {/* Từ sm đến lg các link chữ bị ẩn, nên icon tài khoản dẫn tới /login. */}
                <Link
                  href="/login"
                  aria-label="Đăng nhập"
                  className={`${iconButton} hidden sm:flex lg:hidden`}
                >
                  <UserIcon size={20} />
                </Link>
              </>
            )}

            {/* Trang /wishlist chuyển người chưa đăng nhập tới /login. */}
            <Link
              href="/wishlist"
              aria-label={`Yêu thích, ${wishlistCount} sản phẩm`}
              className={`${iconButton} hidden sm:flex`}
            >
              <HeartIcon size={20} />
              <Badge count={wishlistCount} />
            </Link>

            {/* Trang /cart chuyển người chưa đăng nhập tới /login. */}
            <Link
              href="/cart"
              aria-label={`Giỏ hàng, ${cartCount} sản phẩm`}
              className={iconButton}
            >
              <BagIcon size={20} />
              <Badge count={cartCount} />
            </Link>
          </div>
        </div>

        {/* Tìm kiếm */}
        {searchOpen && (
          <div
            id="header-search"
            className="border-t border-border bg-header-bg px-4 py-3"
          >
            <Form
              action="/products"
              role="search"
              onSubmit={() => setSearchOpen(false)}
              className="mx-auto flex max-w-2xl gap-2"
            >
              <label
                htmlFor="header-search-input"
                className="sr-only"
              >
                Tìm kiếm sản phẩm
              </label>

              <input
                id="header-search-input"
                type="search"
                name="q"
                required
                autoFocus
                placeholder="Tìm kiếm sản phẩm..."
                className="min-w-0 flex-1 border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
              />

              <button
                type="submit"
                className="bg-foreground px-5 py-2 text-sm font-semibold text-background hover:opacity-90"
              >
                Tìm
              </button>
            </Form>
          </div>
        )}

        {/* Menu mobile */}
        {menuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Menu chính"
            className="border-t border-border bg-header-bg px-4 pb-4 md:hidden"
          >
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-border py-3 text-sm font-medium text-header-link transition hover:text-header-link-hover"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              {/* Icon trái tim bị ẩn dưới sm, nên danh sách yêu thích có một mục trong menu. */}
              <li className="sm:hidden">
                <Link
                  href="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-border py-3 text-sm font-medium text-header-link transition hover:text-header-link-hover"
                >
                  Yêu thích ({wishlistCount})
                </Link>
              </li>

              {user ? (
                <>
                  <li>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block border-b border-border py-3 text-sm text-header-link"
                    >
                      Xin chào,{" "}
                      <span className="font-semibold text-foreground">
                        {displayName}
                      </span>
                      {" · Tài khoản của tôi"}
                    </Link>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full py-3 text-left text-sm text-header-link"
                    >
                      Đăng xuất
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block border-b border-border py-3 text-sm font-medium text-header-link"
                    >
                      Đăng nhập
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="block py-3 text-sm font-medium text-header-link"
                    >
                      Đăng ký
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </header>
      <Banner />
    </>

  );
}
