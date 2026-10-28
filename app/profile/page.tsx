"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Lock, LogOut, Package, ShoppingBag, User as UserIcon } from "lucide-react";
import OrderList from "@/app/components/profile/OrderList";
import PasswordForm from "@/app/components/profile/PasswordForm";
import { useShop } from "@/app/components/shop/ShopProvider";
import { useAppSelector } from "@/app/store/store";
import { selectCartCount } from "@/app/store/cartSlice";

type User = { id: number; username: string; fullName?: string; email: string; createdAt?: string };

// Các mục hiển thị trong trang này. Yêu thích và giỏ hàng là trang riêng nên chỉ là link thường.
type Tab = "info" | "orders" | "password";
const tabs: { id: Tab; label: string; Icon: typeof UserIcon }[] = [
  { id: "info", label: "Thông tin tài khoản", Icon: UserIcon },
  { id: "orders", label: "Đơn hàng của tôi", Icon: Package },
  { id: "password", label: "Đổi mật khẩu", Icon: Lock },
];

const menuItemClass =
  "flex shrink-0 items-center gap-3 px-4 py-3 text-sm whitespace-nowrap hover:bg-surface md:w-full";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  // /profile?tab=orders mở lịch sử đơn hàng (link ở trang đơn hàng). Giá trị khác → "info".
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => {
    const fromUrl = searchParams.get("tab");
    return tabs.some((t) => t.id === fromUrl) ? (fromUrl as Tab) : "info";
  });
  const { wishlist } = useShop();
  const cartCount = useAppSelector(selectCartCount);

  // Ai đang đăng nhập? Cùng lời gọi với header. Không có token hoặc token không hợp lệ: chuyển tới trang đăng nhập.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.replace("/login");
          return null;
        }
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => data && setUser(data.user))
      .catch(() => setError("Không kết nối được máy chủ. Vui lòng thử lại."));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Báo header bỏ thông tin người dùng.
    window.dispatchEvent(new Event("logout"));
    router.push("/");
  };

  if (error) {
    return <p role="alert" className="mx-auto w-full max-w-5xl px-4 py-12 text-sale">{error}</p>;
  }
  if (!user) {
    return <p className="mx-auto w-full max-w-5xl px-4 py-12 text-muted">Đang tải thông tin tài khoản...</p>;
  }

  // Tài khoản tạo trước khi có trường tên thì không có fullName.
  const displayName = user.fullName || user.username;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Tài khoản của tôi</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[15rem_1fr]">
        <aside>
          <div className="flex items-center gap-3 border border-border p-4">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground text-lg font-semibold text-background uppercase"
            >
              {displayName.charAt(0)}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold" title={displayName}>{displayName}</span>
              <span className="block truncate text-sm text-muted">@{user.username}</span>
            </span>
          </div>

          {/* Hàng cuộn ngang trên mobile, menu dọc từ md. */}
          <nav aria-label="Danh mục tài khoản" className="mt-4 border border-border">
            <ul className="flex overflow-x-auto md:flex-col md:divide-y md:divide-border">
              {tabs.map(({ id, label, Icon }) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => setTab(id)}
                    aria-current={tab === id ? "page" : undefined}
                    className={`${menuItemClass} ${tab === id ? "bg-surface font-semibold" : "text-muted"}`}
                  >
                    <Icon size={18} aria-hidden="true" />
                    {label}
                  </button>
                </li>
              ))}
              <li>
                <Link href="/wishlist" className={`${menuItemClass} text-muted`}>
                  <Heart size={18} aria-hidden="true" />
                  Yêu thích ({wishlist.length})
                </Link>
              </li>
              <li>
                <Link href="/cart" className={`${menuItemClass} text-muted`}>
                  <ShoppingBag size={18} aria-hidden="true" />
                  Giỏ hàng ({cartCount})
                </Link>
              </li>
              <li>
                <button type="button" onClick={handleLogout} className={`${menuItemClass} text-sale`}>
                  <LogOut size={18} aria-hidden="true" />
                  Đăng xuất
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <div>
          {tab === "info" && (
            <section aria-labelledby="account-info" className="border border-border p-6">
              <h2 id="account-info" className="text-lg font-semibold">Thông tin tài khoản</h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[10rem_1fr]">
                {user.fullName && (
                  <>
                    <dt className="text-muted">Họ và tên</dt>
                    <dd className="font-medium">{user.fullName}</dd>
                  </>
                )}
                <dt className="text-muted">Tên đăng nhập</dt>
                <dd className="font-medium">{user.username}</dd>
                <dt className="text-muted">Email</dt>
                <dd className="font-medium break-all">{user.email}</dd>
                {user.createdAt && (
                  <>
                    <dt className="text-muted">Ngày tham gia</dt>
                    <dd className="font-medium">{new Date(user.createdAt).toLocaleDateString("vi-VN")}</dd>
                  </>
                )}
              </dl>
            </section>
          )}

          {tab === "orders" && <OrderList userId={user.id} />}

          {/* Không đổi được email; chỉ đổi được mật khẩu. */}
          {tab === "password" && <PasswordForm />}
        </div>
      </div>
    </div>
  );
}
