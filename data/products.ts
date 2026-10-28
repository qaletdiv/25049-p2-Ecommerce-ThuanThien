export type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  images: string[];
  thumbnail: string;
  reviews: Review[];
  // Thông số (trang chi tiết). Một số sản phẩm không có thương hiệu. Giá trị chữ bằng tiếng Anh, hiển thị nguyên văn.
  brand?: string;
  sku?: string;
  dimensions?: { width: number; height: number; depth: number };
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
};
export const categoryLabels: Record<string, string> = {
  beauty: "Làm đẹp",
  fragrances: "Nước hoa",
  furniture: "Nội thất",
  groceries: "Thực phẩm",
};

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(value: number) {
  return usd.format(value);
}