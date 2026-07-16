import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useShops } from "../shop.context.js";

export default function ShopsStrip() {
  const { fetchAllShops, allShopsError } = useShops();
  const [shops, setShops] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const result = await fetchAllShops(1, 10);
        if (result.success) setShops(result.shops);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };
    fetchShops();
  }, [fetchAllShops]);

  const scrollBy = (dir) => scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });

  if (allShopsError) return null; // fail quiet on the home teaser, not a hard error block

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            Featured Shops
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Discover merchants</h2>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/shops"
            className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-amber-400 hover:bg-white/5 md:block"
          >
            View all
          </Link>
          <button onClick={() => scrollBy(-1)} className="rounded-full bg-slate-700 px-3 py-1.5 text-white">←</button>
          <button onClick={() => scrollBy(1)} className="rounded-full bg-slate-700 px-3 py-1.5 text-white">→</button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-3 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory">
        {shops.map((shop) => (
          <Link
            key={shop._id}
            to={`/shops/${shop._id}/products`}
            className="group w-44 shrink-0 snap-start overflow-hidden rounded-xl border border-white/10 bg-slate-900 transition hover:-translate-y-1 hover:border-amber-400/50"
          >
            <div className="relative h-20 bg-linear-to-br from-amber-400 via-orange-500 to-red-500">
              <div className="absolute bottom-2 left-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-900 shadow">
                {shop.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="p-3">
              <h3 className="truncate text-sm font-semibold text-white">{shop.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-slate-400">{shop.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}