import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useShops } from "../shop.context.js";

export default function ShopsStrip() {
  // eslint-disable-next-line 
  const { fetchAllShops, allShopsError } = useShops();
  const [shops, setShops] = useState([]);

  const page = 1;
  const limit = 10;

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const result = await fetchAllShops(page, limit);

        if (result.success) {
          setShops(result.shops);
        }
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };

    fetchShops();
  }, [fetchAllShops, page, limit]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            Featured Shops
          </p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            Discover Amazing Merchants
          </h2>

          <p className="mt-3 max-w-2xl text-slate-400">
            Browse stores from local businesses and discover products from
            merchants across the marketplace.
          </p>
        </div>

        <Link
          to="/shops"
          className="hidden rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:border-amber-400 hover:bg-white/5 md:block"
        >
          View All Shops
        </Link>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shops.map((shop) => (
          <Link
            key={shop._id}
            to={`/shops/${shop._id}/products`}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900 transition-all duration-300 hover:-translate-y-2 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10"
          >
            {/* Banner */}
            <div className="relative h-40 bg-linear-to-br from-amber-400 via-orange-500 to-red-500">
              <div className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-slate-900 shadow-lg">
                {shop.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <h3 className="truncate text-xl font-bold text-white">
                  {shop.name}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                  {shop.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>📍</span>
                <span>{shop.location || "Location unavailable"}</span>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition group-hover:bg-amber-400">
                  Visit Store →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
