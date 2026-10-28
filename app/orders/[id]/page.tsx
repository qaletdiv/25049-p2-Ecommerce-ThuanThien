"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { formatPrice } from "@/data/products";
import { bankInfo, paymentLabels, statusLabels, totalsOf, type Order } from "@/data/orders";
import { useLoginRequired } from "@/app/components/shop/useLoginRequired";

const notFoundMessage = "Không tìm thấy đơn hàng.";

// Một đơn hàng của người dùng đã đăng nhập. Ngay sau khi thanh toán còn hiện "Đặt hàng thành công".
export default function OrderPage() {
  useLoginRequired();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [justPlaced, setJustPlaced] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // GET /api/orders/:id không kiểm tra ai đang hỏi, nên trước tiên xác định ai đang đăng nhập,
    // rồi chỉ hiện đơn hàng nếu nó thuộc về người đó.
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.dispatchEvent(new Event("logout"));
          router.replace("/login");
          return null;
        }
        if (!res.ok) throw new Error("Không tải được đơn hàng. Vui lòng thử lại.");
        const { user } = await res.json();

        const orderRes = await fetch(`/api/orders/${encodeURIComponent(id)}`);
        if (orderRes.status === 404) throw new Error(notFoundMessage);
        if (!orderRes.ok) throw new Error("Không tải được đơn hàng. Vui lòng thử lại.");
        const found: Order = (await orderRes.json()).data;
        if (String(found.idUser) !== String(user.id)) throw new Error(notFoundMessage);
        return found;
      })
      .then((found) => {
        if (!found) return;
        setOrder(found);
        // Do trang thanh toán đặt ngay sau khi đặt đơn này.
        if (sessionStorage.getItem("placedOrder") === id) {
          setJustPlaced(true);
          sessionStorage.removeItem("placedOrder");
        }
      })
      .catch((err: Error) => setError(err.message));
  }, [id, router]);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <p role="alert" className="text-sale">{error}</p>
        <Link href="/profile" className="mt-4 inline-block text-sm underline underline-offset-4">
          Về tài khoản của tôi
        </Link>
      </div>
    );
  }
  if (!order) {
    return <p className="mx-auto w-full max-w-3xl px-4 py-12 text-muted">Đang tải đơn hàng...</p>;
  }

  // Backend chỉ lưu totalPrice; các dòng còn lại được tính từ danh sách sản phẩm đã lưu.
  const totals = totalsOf(order.items);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      {justPlaced && (
        <div role="status" className="mb-8 bg-success-bg p-6 text-success">
          <p className="text-xl font-semibold">Đặt hàng thành công!</p>
          <p className="mt-1 text-sm">
            Cảm ơn bạn đã mua sắm tại Northline. Chúng tôi sẽ liên hệ qua số {order.phoneNumber} để xác nhận đơn hàng.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-semibold">Đơn hàng #{order.id}</h1>
        <span className="bg-surface px-3 py-1 text-sm font-medium">
          {statusLabels[order.status] ?? order.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">Đặt lúc {new Date(order.createdAt).toLocaleString("vi-VN")}</p>

      {order.paymentMethod === "bank" && (
        <section aria-labelledby="bank-transfer" className="mt-6 border border-foreground p-6">
          <h2 id="bank-transfer" className="font-semibold">Thông tin chuyển khoản</h2>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-[10rem_1fr]">
            <dt className="text-muted">Ngân hàng</dt>
            <dd className="font-medium">{bankInfo.bank}</dd>
            <dt className="text-muted">Số tài khoản</dt>
            <dd className="font-medium">{bankInfo.accountNumber}</dd>
            <dt className="text-muted">Chủ tài khoản</dt>
            <dd className="font-medium">{bankInfo.accountName}</dd>
            <dt className="text-muted">Số tiền</dt>
            <dd className="font-medium">{formatPrice(order.totalPrice)}</dd>
            <dt className="text-muted">Nội dung</dt>
            <dd className="font-medium">Northline {order.id}</dd>
          </dl>
        </section>
      )}

      <section aria-labelledby="order-items" className="mt-8">
        <h2 id="order-items" className="text-lg font-semibold">Sản phẩm</h2>
        <ul className="mt-3 divide-y divide-border border-y border-border">
          {order.items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-4 text-sm">
              <Link href={`/products/${item.productId}`} className="relative h-20 w-16 shrink-0 bg-surface">
                <Image src={item.thumbnail} alt={item.title} fill sizes="64px" className="object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/products/${item.productId}`} className="font-medium hover:underline">
                  {item.title}
                </Link>
                <p className="mt-1 text-muted">
                  {item.quantity} × {formatPrice(item.salePrice)}
                </p>
              </div>
              <p className="font-medium">{formatPrice(item.salePrice * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-4 ml-auto max-w-xs space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Tạm tính</dt>
            <dd>{formatPrice(totals.subtotal)}</dd>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">Giảm giá</dt>
              <dd className="text-sale">−{formatPrice(totals.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted">Phí vận chuyển</dt>
            <dd>{totals.shippingFee === 0 ? "Miễn phí" : formatPrice(totals.shippingFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <dt>Tổng cộng</dt>
            <dd>{formatPrice(order.totalPrice)}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="order-shipping" className="mt-8 grid gap-6 border border-border p-6 text-sm sm:grid-cols-2">
        <div>
          <h2 id="order-shipping" className="font-semibold">Giao đến</h2>
          <p className="mt-2">{order.customerName}</p>
          <p className="text-muted">{order.phoneNumber}</p>
          <p className="text-muted">{order.address}</p>
        </div>
        <div>
          <h2 className="font-semibold">Thanh toán</h2>
          <p className="mt-2">{paymentLabels[order.paymentMethod] ?? order.paymentMethod}</p>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/products" className="bg-foreground px-6 py-3 font-semibold text-background hover:opacity-90">
          Tiếp tục mua sắm
        </Link>
        <Link href="/profile?tab=orders" className="border border-foreground px-6 py-3 font-semibold hover:bg-surface">
          Xem lịch sử đơn hàng
        </Link>
      </div>
    </div>
  );
}
