"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice, type Product } from "@/data/products";
import { orderTotals, paymentLabels, salePriceOf, type Order, type PaymentMethod } from "@/data/orders";
import { checkoutSchema, validateForm } from "@/app/components/forms/authSchemas";
import { buttonClass, errorClass, inputClass, labelClass } from "@/app/components/forms/styles";
import { useCartActions } from "@/app/components/cart/useCartActions";
import { useLoginRequired } from "@/app/components/shop/useLoginRequired";
import { useAppSelector } from "@/app/store/store";
import { selectCart } from "@/app/store/cartSlice";

type Values = { customerName: string; phoneNumber: string; address: string; paymentMethod: PaymentMethod };
type Field = keyof Values;

const textFields: { name: Exclude<Field, "paymentMethod">; label: string; type: string; autoComplete: string }[] = [
  { name: "customerName", label: "Họ và tên người nhận", type: "text", autoComplete: "name" },
  { name: "phoneNumber", label: "Số điện thoại", type: "tel", autoComplete: "tel" },
  { name: "address", label: "Địa chỉ giao hàng", type: "text", autoComplete: "street-address" },
];

const paymentHints: Record<PaymentMethod, string> = {
  cod: "Thanh toán bằng tiền mặt khi nhận hàng.",
  bank: "Thông tin tài khoản sẽ hiện sau khi đặt hàng. Nội dung chuyển khoản là mã đơn hàng.",
};

// Thông tin giao hàng + phương thức thanh toán, rồi POST /api/orders. Backend lưu đúng những gì được gửi
// (không tự tính giá hay làm trống giỏ hàng), nên trang này tự tạo danh sách sản phẩm và tổng tiền,
// rồi tự làm trống giỏ hàng.
export default function CheckoutPage() {
  useLoginRequired();
  const router = useRouter();
  const { clear } = useCartActions();
  const { items, status } = useAppSelector(selectCart);

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  // Backend cần id người dùng trong đơn hàng (idUser).
  const [userId, setUserId] = useState<number | null>(null);
  const [values, setValues] = useState<Values>({ customerName: "", phoneNumber: "", address: "", paymentMethod: "cod" });
  const [errors, setErrors] = useState<Partial<Record<Field | "form", string>>>({});
  const [submitting, setSubmitting] = useState(false);
  // True sau khi đặt hàng xong, trong lúc chuyển sang trang đơn hàng (lúc đó giỏ hàng đã trống).
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : []))
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Ai đang đặt hàng: id đưa vào đơn hàng, tên điền sẵn vào form (vẫn có thể sửa).
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.dispatchEvent(new Event("logout"));
          router.replace("/login");
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((data) => {
        if (!data?.user) return;
        setUserId(data.user.id);
        const name = data.user.fullName;
        if (name) setValues((v) => (v.customerName ? v : { ...v, customerName: name }));
      })
      .catch(() => {});
  }, [router]);

  const lines = items
    .map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) }))
    .filter((line): line is typeof line & { product: Product } => Boolean(line.product));
  const totals = orderTotals(lines);

  const setValue = (name: Field, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined, form: undefined }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = await validateForm(checkoutSchema, values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    if (userId === null) {
      setErrors({ form: "Không tải được thông tin tài khoản. Vui lòng tải lại trang." });
      return;
    }

    const body = {
      idUser: userId,
      customerName: values.customerName.normalize("NFC").trim().replace(/\s+/g, " "),
      phoneNumber: values.phoneNumber.replace(/[\s.-]/g, ""),
      address: values.address.trim().replace(/\s+/g, " "),
      paymentMethod: values.paymentMethod,
      // Chép vào đơn hàng để vẫn hiện đúng tên và giá nếu sau này sản phẩm thay đổi.
      items: lines.map(({ productId, quantity, product }) => ({
        productId,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        salePrice: salePriceOf(product),
        quantity,
      })),
      totalPrice: totals.total,
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ form: data.message ?? "Đặt hàng thất bại. Vui lòng thử lại." });
        return;
      }
      const order: Order = data.data;
      setPlaced(true);
      // Để trang đơn hàng hiện "Đặt hàng thành công".
      sessionStorage.setItem("placedOrder", String(order.id));
      // Backend không làm trống giỏ hàng nên làm ở đây (đồng thời đưa số trên header về 0).
      await clear();
      router.push(`/orders/${order.id}`);
    } catch {
      setErrors({ form: "Không kết nối được máy chủ. Vui lòng thử lại." });
    } finally {
      setSubmitting(false);
    }
  };

  const loading = loadingProducts || status === "idle" || status === "loading";
  const cartEmpty = !loading && lines.length === 0;

  // Thanh toán cần có sản phẩm trong giỏ: giỏ trống thì quay về /cart.
  // Trừ khi vừa đặt hàng xong (lúc đó giỏ hàng được cố ý làm trống).
  useEffect(() => {
    if (cartEmpty && !placed) router.replace("/cart");
  }, [cartEmpty, placed, router]);

  if (placed) {
    return <p className="mx-auto w-full max-w-7xl px-4 py-10 text-muted">Đang chuyển tới đơn hàng của bạn...</p>;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Thanh toán</h1>

      {loading ? (
        <p className="mt-8 text-muted">Đang tải...</p>
      ) : cartEmpty ? (
        <p className="mt-8 text-muted">Giỏ hàng đang trống. Đang chuyển về giỏ hàng...</p>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
          <form id="checkout-form" onSubmit={handleSubmit} noValidate className="space-y-6">
            <section aria-labelledby="shipping-info" className="space-y-4 border border-border p-6">
              <h2 id="shipping-info" className="text-lg font-semibold">Thông tin giao hàng</h2>
              {textFields.map((f) => {
                const id = `checkout-${f.name}`;
                return (
                  <div key={f.name}>
                    <label htmlFor={id} className={labelClass}>{f.label}</label>
                    <input
                      id={id}
                      name={f.name}
                      type={f.type}
                      autoComplete={f.autoComplete}
                      value={values[f.name]}
                      onChange={(e) => setValue(f.name, e.target.value)}
                      aria-invalid={Boolean(errors[f.name])}
                      aria-describedby={errors[f.name] ? `${id}-error` : undefined}
                      className={inputClass}
                    />
                    {errors[f.name] && <p id={`${id}-error`} className={`mt-1 ${errorClass}`}>{errors[f.name]}</p>}
                  </div>
                );
              })}
            </section>

            <fieldset className="border border-border p-6">
              <legend className="px-1 text-lg font-semibold">Phương thức thanh toán</legend>
              <div className="mt-2 space-y-3">
                {(Object.keys(paymentLabels) as PaymentMethod[]).map((method) => (
                  <label
                    key={method}
                    className={`flex cursor-pointer items-start gap-3 border p-4 text-sm ${
                      values.paymentMethod === method ? "border-foreground" : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={values.paymentMethod === method}
                      onChange={() => setValue("paymentMethod", method)}
                      className="mt-0.5"
                    />
                    <span>
                      <span className="block font-medium">{paymentLabels[method]}</span>
                      <span className="block text-muted">{paymentHints[method]}</span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.paymentMethod && <p className={`mt-2 ${errorClass}`}>{errors.paymentMethod}</p>}
            </fieldset>
          </form>

          <aside aria-labelledby="checkout-summary" className="bg-surface p-6 lg:sticky lg:top-24">
            <h2 id="checkout-summary" className="text-lg font-semibold">Đơn hàng ({lines.length} sản phẩm)</h2>
            <ul className="mt-4 space-y-3">
              {lines.map(({ productId, quantity, product }) => (
                <li key={productId} className="flex gap-3 text-sm">
                  <span className="relative h-16 w-12 shrink-0 bg-background">
                    <Image src={product.thumbnail} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2">{product.title}</span>
                    <span className="text-muted">
                      {quantity} × {formatPrice(salePriceOf(product))}
                    </span>
                  </span>
                  <span className="font-medium">{formatPrice(salePriceOf(product) * quantity)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
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
                <dd>{formatPrice(totals.total)}</dd>
              </div>
            </dl>

            {errors.form && <p role="alert" className={`mt-4 ${errorClass}`}>{errors.form}</p>}

            {/* Nút nằm ngoài <form> nên trỏ tới form bằng form="checkout-form". */}
            <button type="submit" form="checkout-form" disabled={submitting} className={`mt-6 ${buttonClass}`}>
              {submitting ? "Đang đặt hàng..." : "Xác nhận đặt hàng"}
            </button>
            <Link href="/cart" className="mt-4 block text-center text-sm underline underline-offset-4">
              Quay lại giỏ hàng
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
