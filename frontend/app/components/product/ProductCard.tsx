import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/data/products";
import WishlistButton from "@/app/components/shop/WishlistButton";
import AddToCartButton from "@/app/components/cart/AddToCartButton";

// addToCart: show a "Thêm vào giỏ hàng" button over the bottom of the image (home page "Sản phẩm yêu thích" only).
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

      {/* Outside the link (a button cannot sit inside <a>), placed over the image's top-right corner. */}
      <WishlistButton productId={product.id} className="absolute top-2 right-2" />

      {/* Also outside the link, over the bottom of the image. */}
      {addToCart && <AddToCartButton productId={product.id} productTitle={product.title} />}

      {/* Price on the left, rating on the right. On narrow cards the rating wraps to the next line. */}
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
