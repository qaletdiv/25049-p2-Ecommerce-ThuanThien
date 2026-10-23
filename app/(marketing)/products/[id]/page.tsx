import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/app/components/product/ProductCard";
import ProductActions from "@/app/components/product/ProductActions";
import ProductGallery from "@/app/components/product/ProductGallery";
import { categoryLabels, formatPrice, type Product } from "@/data/products";

async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:5000/api/products");
  if (!res.ok) throw new Error("Không tải được danh sách sản phẩm");
  return res.json();
}

// Pre-render one page per product at build time.
export async function generateStaticParams() {
  const products = await getProducts();
  // Route params are strings; the backend id is a number.
  return products.map((p) => ({ id: String(p.id) }));
}

export default async function ProductDetailPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  // The backend has no /api/products/:id, so find it in the full list.
  const products = await getProducts();
  const product = products.find((p) => String(p.id) === id);

  if (!product) {
    notFound();
  }

  const salePrice = product.price * (1 - product.discountPercentage / 100);
  const onSale = product.discountPercentage > 0;
  const categoryLabel = categoryLabels[product.category] ?? product.category;
  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  // Specifications table: only the fields this product has.
  const specs = [
    { label: "Thương hiệu", value: product.brand },
    { label: "Mã sản phẩm (SKU)", value: product.sku },
    { label: "Danh mục", value: categoryLabel },
    {
      label: "Kích thước (R × C × S)",
      value: product.dimensions &&
        `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`,
    },
    { label: "Bảo hành", value: product.warrantyInformation },
    { label: "Vận chuyển", value: product.shippingInformation },
    { label: "Đổi trả", value: product.returnPolicy },
  ].filter((s) => s.value);
  // Up to 4 other products from the same category.
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-foreground hover:underline">Trang chủ</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/products" className="hover:text-foreground hover:underline">Sản phẩm</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/products?category=${product.category}`} className="hover:text-foreground hover:underline">
              {categoryLabel}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">{product.title}</li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <ProductGallery images={images} title={product.title} />

        <div>
          <h1 className="text-3xl font-semibold">{product.title}</h1>
          <Link
            href={`/products/${product.id}/reviews`}
            className="mt-2 inline-block text-sm text-muted hover:text-foreground hover:underline"
          >
            ★ {product.rating.toFixed(1)} · {product.reviews.length} đánh giá
          </Link>

          <p className="mt-4 text-lg">
            <span className="font-semibold">{formatPrice(salePrice)}</span>
            {onSale && (
              <>
                <span className="ml-2 text-muted line-through">{formatPrice(product.price)}</span>
                <span className="ml-2 bg-accent px-2 py-0.5 text-xs font-semibold text-accent-contrast">
                  Giảm {product.discountPercentage.toFixed(0)}%
                </span>
              </>
            )}
          </p>

          <div className="mt-8 max-w-xs">
            <ProductActions productId={product.id} />
          </div>

          <Link href="/products" className="mt-8 inline-block text-sm underline underline-offset-4">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>

      <section aria-labelledby="details" className="mt-16">
        <h2 id="details" className="text-2xl font-semibold">Chi tiết sản phẩm</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted">{product.description}</p>
      </section>

      <section aria-labelledby="specs" className="mt-12">
        <h2 id="specs" className="text-2xl font-semibold">Thông số kỹ thuật</h2>
        <dl className="mt-4 max-w-3xl divide-y divide-border border-y border-border text-sm">
          {specs.map((s) => (
            <div key={s.label} className="grid gap-1 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
              <dt className="text-muted">{s.label}</dt>
              <dd className="font-medium">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-16">
          <h2 id="related" className="text-2xl font-semibold">Sản phẩm liên quan</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
