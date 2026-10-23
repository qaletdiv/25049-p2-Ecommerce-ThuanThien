import type { Product } from "@/data/products";

export type PaymentMethod = "cod" | "bank";

// One line of an order. The checkout page copies title, price and thumbnail into the order,
// so the order stays the same even if the product changes later.
export type OrderItem = {
  productId: number;
  title: string;
  thumbnail: string;
  price: number;
  salePrice: number;
  quantity: number;
};

// Same shape as the backend's orders (server.js, POST /api/orders). The backend stores what the
// frontend sends: it does not compute totalPrice itself.
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

// Shipping is decided on the frontend only (the backend has no shipping fee).
export const SHIPPING_FEE = 5;
export const FREE_SHIPPING_FROM = 50;

export const paymentLabels: Record<PaymentMethod, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  bank: "Chuyển khoản ngân hàng",
};

export const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
};

// Placeholder bank account shown for "bank" orders.
export const bankInfo = {
  bank: "Vietcombank",
  accountNumber: "0123456789",
  accountName: "CONG TY NORTHLINE",
};

// Round to cents (avoids 19.990000000000002).
export const roundMoney = (n: number) => Math.round(n * 100) / 100;

export const salePriceOf = (p: Product) => roundMoney(p.price * (1 - p.discountPercentage / 100));

// Totals from the original price and the sale price of each line.
// Used by the cart and checkout (from products) and by the order pages (from the saved items).
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

// Same as totalsOf, for cart lines joined with their product.
export const orderTotals = (lines: { product: Product; quantity: number }[]) =>
  totalsOf(lines.map((l) => ({ price: l.product.price, salePrice: salePriceOf(l.product), quantity: l.quantity })));
