"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/data/products";
import { statusLabels, type Order } from "@/data/orders";

// Đơn hàng của người dùng đã đăng nhập, mới nhất trước (GET /api/orders/user/:userId).
// Trang hồ sơ đã kiểm tra đăng nhập và truyền id người dùng vào.
export default function OrderList({ userId }: { userId: number }) {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        fetch(`/api/orders/user/${userId}`)
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((data: { data: Order[] }) =>
                setOrders(
                    [...data.data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
                ),
            )
            .catch(() => setError("Không tải được lịch sử đơn hàng. Vui lòng thử lại."));
    }, [userId]);

    return (
        <section aria-labelledby="my-orders" className="border border-border p-6">
            <h2 id="my-orders" className="text-lg font-semibold">Đơn hàng của tôi</h2>

            {error ? (
                <p role="alert" className="mt-4 text-sm text-sale">{error}</p>
            ) : orders === null ? (
                <p className="mt-4 text-sm text-muted">Đang tải...</p>
            ) : orders.length === 0 ? (
                <p className="mt-4 text-sm text-muted">
                    Bạn chưa có đơn hàng nào.{" "}
                    <Link href="/products" className="text-foreground underline underline-offset-4">
                        Mua sắm ngay
                    </Link>
                </p>
            ) : (
                <ul className="mt-4 divide-y divide-border border-y border-border">
                    {orders.map((order) => (
                        <li key={order.id}>
                            <Link
                                href={`/orders/${order.id}`}
                                className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 text-sm hover:bg-surface"
                            >
                                <span>
                                    <span className="block font-medium">Đơn hàng #{order.id}</span>
                                    <span className="block text-muted">
                                        {new Date(order.createdAt).toLocaleDateString("vi-VN")} ·{" "}
                                        {order.items.reduce((sum, i) => sum + i.quantity, 0)} sản phẩm
                                    </span>
                                </span>
                                <span className="text-right">
                                    <span className="block font-semibold">{formatPrice(order.totalPrice)}</span>
                                    <span className="block text-muted">{statusLabels[order.status] ?? order.status}</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
