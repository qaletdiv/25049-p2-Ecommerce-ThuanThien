import type { Product } from "@/data/products";

export type PaymentMethod = "cod" | "bank";

// Một dòng của đơn hàng. Trang thanh toán chép tên, giá và ảnh thu nhỏ vào đơn hàng,
// để đơn hàng giữ nguyên dù sau này sản phẩm thay đổi.
export type OrderItem = {
  productId: number;
  title: string;
  thumbnail: string;
  price: number;
  salePrice: number;
  quantity: number;
};

// Cùng cấu trúc với đơn hàng của backend (server.js, POST /api/orders). Backend lưu những gì
// frontend gửi: nó không tự tính totalPrice.
export type Order = {
  id: number;
  idUser: number;
  customerName: string;
  address: string;
  phoneNumber: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
};

// Phí giao hàng chỉ do frontend quyết định (backend không có phí giao hàng).
export const SHIPPING_FEE = 5;
export const FREE_SHIPPING_FROM = 50;

export const paymentLabels: Record<PaymentMethod, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  bank: "Chuyển khoản ngân hàng",
};

export const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
};

// Tài khoản ngân hàng tạm hiển thị cho đơn "bank".
export const bankInfo = {
  bank: "Vietcombank",
  accountNumber: "0123456789",
  accountName: "CONG TY NORTHLINE",
};

// Làm tròn đến cent (tránh 19.990000000000002).
export const roundMoney = (n: number) => Math.round(n * 100) / 100;

export const salePriceOf = (p: Product) => roundMoney(p.price * (1 - p.discountPercentage / 100));

// Tổng tiền tính từ giá gốc và giá bán của từng dòng.
// Dùng cho giỏ hàng và thanh toán (từ sản phẩm) và các trang đơn hàng (từ danh sách đã lưu).
export function totalsOf(lines: { price: number; salePrice: number; quantity: number }[]) {
  const subtotal = roundMoney(lines.reduce((sum, l) => sum + l.price * l.quantity, 0));
  const itemsTotal = roundMoney(lines.reduce((sum, l) => sum + l.salePrice * l.quantity, 0));
  const shippingFee = lines.length === 0 || itemsTotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
  return {
    subtotal,
    discount: roundMoney(subtotal - itemsTotal),
    itemsTotal,
    shippingFee,
    total: roundMoney(itemsTotal + shippingFee),
  };
}

// Giống totalsOf, cho các dòng giỏ hàng đã ghép với sản phẩm.
export const orderTotals = (lines: { product: Product; quantity: number }[]) =>
  totalsOf(lines.map((l) => ({ price: l.product.price, salePrice: salePriceOf(l.product), quantity: l.quantity })));
