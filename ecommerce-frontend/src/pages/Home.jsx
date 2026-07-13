import Hero from "../components/Hero";
import HomePageProductCard from "../features/products/components/HomePageProductCard";
import useProducts from "../features/products/hooks/useProducts.js";

function Home() {
  const { products, loading, isLoadingMore, hasMore, loadMore, error } = useProducts();
  console.log("Home products:", products); // Debugging line to check the products state
  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
            Shop all
          </p>
          <h1 className="text-3xl font-bold text-white">
            Discover the essentials
          </h1>
          <p className="max-w-2xl text-slate-300">
            Browse products from every shop on the platform.
          </p>
        </div>

        {loading ? (
          // Only the very first load shows this — "Load more" clicks use
          // isLoadingMore instead, so the grid never disappears once
          // there's something on screen.
          <p className="text-white">Loading products...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-slate-300">No products available at the moment.</p>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <HomePageProductCard key={product.id || product._id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? "Loading..." : "Load more products"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default Home;