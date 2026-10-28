import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/data/products";
import WishlistButton from "@/app/components/shop/WishlistButton";
import AddToCartButton from "@/app/components/cart/AddToCartButton";

// addToCart: hiện nút "Thêm vào giỏ hàng" đè lên phần dưới ảnh (chỉ ở mục "Sản phẩm yêu thích" trên trang chủ).
export default function ProductCard({ product, addToCart = false }: { product: Product; addToCart?: boolean }) {
  const salePrice =
    product.price * (1 - product.discountPercentage / 100);

  const onSale = product.discountPercentage > 0;

  return (
    <article className="group relative">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-surface">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {onSale && (
            <span className="absolute top-2 left-2 bg-accent px-2 py-0.5 text-xs font-semibold text-accent-contrast">
              Giảm {product.discountPercentage.toFixed(0)}%
            </span>
          )}
        </div>

        <h3 className="mt-3 line-clamp-2 text-base font-medium group-hover:underline">
          {product.title}
        </h3>
      </Link>

      {/* Nằm ngoài link (button không được nằm trong <a>), đặt đè lên góc trên bên phải của ảnh. */}
      <WishlistButton productId={product.id} className="absolute top-2 right-2" />

      {/* Cũng nằm ngoài link, đè lên phần dưới ảnh. */}
      {addToCart && <AddToCartButton productId={product.id} productTitle={product.title} />}

      {/* Giá bên trái, đánh giá bên phải. Trên thẻ hẹp thì đánh giá xuống dòng. */}
      <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-2">
        <p className="text-sm">
          <span className="font-semibold">
            {formatPrice(salePrice)}
          </span>

          {onSale && (
            <>
              {" "}
              <span className="text-muted line-through">
                {formatPrice(product.price)}
              </span>
            </>
          )}
        </p>

        <p className="text-xs text-muted">
          <span aria-hidden="true">★</span> {product.rating.toFixed(1)}
          <span className="sr-only"> trên 5 sao</span>
        </p>
      </div>
    </article>
  );
}
