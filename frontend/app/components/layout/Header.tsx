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
// Text links on the right from lg: "Đăng nhập" / "Đăng ký" or "Tài khoản của tôi" / "Đăng xuất".
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
  // Total pieces in the cart, from the Redux store (loaded from the backend by StoreProvider).
  const cartCount = useAppSelector(selectCartCount);

  // Send the JWT from localStorage to the backend to find out who is logged in.
  // Runs again on every page change, so the header updates right after logging in or registering.
  useEffect(() => {
    const token = localStorage.getItem("token");
    // No token: not logged in (user is already null; logout clears it too).
    if (!token) return;

    // Log out automatically when the token expires (1 hour after login).
    // The middle part of the JWT is base64url JSON with "exp" in seconds.
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
      // Not a valid JWT: /api/auth/me below will reject it.
    }

    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        // Token is invalid or expired: forget it.
        if (!res.ok) localStorage.removeItem("token");
        return res.ok ? res.json() : { user: null };
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));

    return () => clearTimeout(timer);
  }, [pathname, router]);

  // Other pages (e.g. /profile) log out by removing the token and sending a "logout" event.
  useEffect(() => {
    const onLogout = () => setUser(null);
    window.addEventListener("logout", onLogout);
    return () => window.removeEventListener("logout", onLogout);
  }, []);

  // Greet by full name; accounts made before the name field only have a username.
  const displayName = user?.fullName || user?.username;

  const handleLogout = () => {
    // Logging out only means forgetting the token (the "logout" event clears the wishlist too).
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("logout"));
    setMenuOpen(false);
    router.push("/");
  };

  // Close the mobile menu and the search bar on Escape.
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

          {/* Mobile Menu Button */}
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

          {/* Desktop Menu */}
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

          {/* Right Icons */}
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
                {/* The name is in the tooltip; the profile page shows it in full. */}
                <Link href="/profile" title={displayName} className={`${textLink} font-semibold text-foreground`}>
                  Tài khoản của tôi
                </Link>

                {/* Between sm and lg the text link is hidden, so the account icon links to the profile. */}
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

                {/* Between sm and lg the text links are hidden, so the account icon links to /login. */}
                <Link
                  href="/login"
                  aria-label="Đăng nhập"
                  className={`${iconButton} hidden sm:flex lg:hidden`}
                >
                  <UserIcon size={20} />
                </Link>
              </>
            )}

            {/* The /wishlist page sends logged-out users to /login. */}
            <Link
              href="/wishlist"
              aria-label={`Yêu thích, ${wishlistCount} sản phẩm`}
              className={`${iconButton} hidden sm:flex`}
            >
              <HeartIcon size={20} />
              <Badge count={wishlistCount} />
            </Link>

            {/* The /cart page sends logged-out users to /login. */}
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

        {/* Search */}
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

        {/* Mobile Menu */}
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

              {/* The heart icon is hidden below sm, so the wishlist gets a menu item. */}
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
