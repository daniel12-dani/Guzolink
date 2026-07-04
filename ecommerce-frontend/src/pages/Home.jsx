import Hero from "../components/Hero";
import ProductCard from "../features/products/components/ProductCard";
import useProducts from "../features/products/hooks/useProducts";

function Home() {
  const { products, loading, error } = useProducts();

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

        {loading ? (
          <p className="text-white">Loading products...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
