import Hero from "../components/Hero";
import ProductCard from "../features/products/components/ProductCard";
import { useCatalog } from "../features/products/catalog.context";

function Home() {
  const { products } = useCatalog();

  return (
    <div>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">Featured products</p>
            <h2 className="text-3xl font-bold text-white">Popular picks for your next order</h2>
          </div>
          <a href="/products" className="text-sm font-semibold text-slate-300 hover:text-amber-500">
            View all products →
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
