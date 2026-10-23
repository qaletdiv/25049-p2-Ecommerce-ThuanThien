import Link from "next/link";
import ProductCard from "@/app/components/product/ProductCard";
import { categoryLabels, type Product } from "@/data/products";

// Temporary version: the hero gets redesigned in the "home" step.
export default async function Home() {
  const res = await fetch("http://localhost:5000/api/products");
  if (!res.ok) throw new Error("Không tải được danh sách sản phẩm");
  const products: Product[] = await res.json();

  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const categories = products.reduce<{ name: string; items: Product[] }[]>((acc, p) => {
    const found = acc.find((c) => c.name === p.category);
    if (found) found.items.push(p);
    else acc.push({ name: p.category, items: [p] });
    return acc;
  }, []);


  return (
    <>

      <section aria-labelledby="top-rated" className="mx-auto w-full max-w-7xl px-4 pt-12">
        <h2 id="top-rated" className="text-2xl font-semibold">Sản phẩm yêu thích</h2>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {topRated.map((p) => (
            <ProductCard key={p.id} product={p} buyNow />
          ))}
        </div>
      </section>

      <section aria-labelledby="by-category" className="mx-auto w-full max-w-7xl px-4 pt-12">
        <h2 id="by-category" className="text-2xl font-semibold">Theo danh mục</h2>
        {categories.map((c) => (
          <div key={c.name} className="mt-10">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-lg font-semibold">
                {categoryLabels[c.name] ?? c.name}{" "}
                <span className="text-sm font-normal text-muted">({c.items.length} sản phẩm)</span>
              </h3>
              <Link href={`/products?category=${c.name}`} className="text-sm underline underline-offset-4">
                Xem tất cả
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
              {c.items.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
