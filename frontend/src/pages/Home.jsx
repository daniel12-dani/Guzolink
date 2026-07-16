import Hero from "../components/Hero.jsx";
import ShopsStrip from "../features/shop/components/HomePageShopCard.jsx";
import CategoryStrip from "../features/categories/components/CategoryStrip.jsx";
import HowItWorksSection from "../components/HowItWorksSection.jsx";
import MerchantCTA from "../components/MerchantCTA.jsx";
import HomePageProductCard from "../features/products/components/HomePageProductCard.jsx";
import useProducts from "../features/products/hooks/useProducts.js";
import LoadingSpinner from "../components/Spinner.jsx";
import ProductsUnavailable from "../features/products/components/NoProductModal.jsx";
import { useEffect, useRef } from "react";

function Home() {
  const { products, loading, isLoadingMore, hasMore, loadMore, error } =
    useProducts();
  const featured = (products?? []).slice(0, -1)
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 250, behavior: "smooth" });
  };
  const scrollUp = () => {
    scrollRef.current?.scrollBy({ top: 100, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        scrollUp();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Log the real error for devs/monitoring, but never surface it raw to users
  useEffect(() => {
    if (error) {
      console.error("useProducts failed:", error);
      // reportErrorToMonitoring?.(error); // e.g. Sentry, LogRocket, etc.
    }
  }, [error]);

  return (
    <div>
      <Hero />
      <div className="space-y-12 py-4">
        <CategoryStrip />

        {!loading && !error && featured.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-widest text-amber-500">
                  Featured
                </p>
                <h2 className="text-3xl font-bold text-white">
                  Popular picks right now
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={scrollLeft}
                  className="rounded-full bg-slate-700 px-4 py-2 text-white"
                >
                  ←
                </button>
                <button
                  onClick={scrollRight}
                  className="rounded-full bg-slate-700 px-4 py-2 text-white"
                >
                  →
                </button>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
            >
              { products.length === 0 ?  featured.map((product) => (
                <div key={product.id} className="w-52 shrink-0 snap-start">
                  <HomePageProductCard product={product} />
                </div>
              )): null}
            </div>
          </section>
        )}

        <ShopsStrip />

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div id="products" className="mb-10 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
              Shop all
            </p>
            <h2 className="text-3xl font-bold text-white">
              Discover the essentials
            </h2>
            <p className="max-w-2xl text-slate-300">
              Browse products from every shop on the platform.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading products..." />
          ) : error ? (
            <ProductsUnavailable onRetry={loadMore} />
          ) : products.length === 0 ? (
            <ProductsUnavailable
              message="No products available at the moment."
              onRetry={loadMore}
            />
          ) : (
            <>
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                }}
              >
                {products.map((product) => (
                  <HomePageProductCard key={product.id} product={product} />
                ))}
              </div>
              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoadingMore ? "Loading..." : "Load more products"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <HowItWorksSection />
        <MerchantCTA />
      </div>
    </div>
  );
}

export default Home;
