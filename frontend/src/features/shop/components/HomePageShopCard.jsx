import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { useShops } from "../shop.context.js";
import LoadingSpinner from "../../../components/Spinner.jsx";
import ShopsUnavailable from "./NoShopModal.jsx";
import { useAuth } from "../../auth/auth.context.js";

export default function ShopsStrip() {
  const { fetchAllShops, allShopsError } = useShops();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);
  const scrollRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const fetchShops = async () => {
      setLoading(true);
      try {
        const result = await fetchAllShops(1, 10);
        if (!cancelled && result.success) setShops(result.shops ?? []);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchShops();
    return () => {
      cancelled = true;
    };
  }, [fetchAllShops, retryKey]);

  const handleRetry = useCallback(() => setRetryKey((k) => k + 1), []);
  const scrollBy = (dir) =>
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            Featured Shops
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Discover merchants
          </h2>
        </div>

        {!loading && !allShopsError && shops.length > 0 && (
          <div className="flex items-center gap-2">
            <Link
              to="/shops"
              className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-amber-400 hover:bg-white/5 md:block"
            >
              View all
            </Link>
            <button
              onClick={() => scrollBy(-1)}
              className="rounded-full bg-slate-700 px-3 py-1.5 text-white"
            >
              ←
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="rounded-full bg-slate-700 px-3 py-1.5 text-white"
            >
              →
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading shops..." />
      ) : allShopsError ? (
        <ShopsUnavailable onRetry={handleRetry} />
      ) : shops.length === 0 ? (
        <ShopsUnavailable
          message="No shops available right now."
          onRetry={handleRetry}
        />
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
        >
          {shops.map((shop) => {
            const isOwner =
              user &&
              shop &&
              (user.id || user._id)?.toString() === shop.owner?.toString();
            {/* console.log("shop owner and shop", isOwner, shop); */}
            return (
              <Link
                key={shop._id}
                to={`/shops/${shop._id}/`}
                className={`group w-56 shrink-0 snap-start overflow-hidden rounded-xl border bg-slate-900 transition hover:-translate-y-1 ${
                  isOwner
                    ? "border-emerald-500/40 hover:border-emerald-400/70"
                    : "border-white/10 hover:border-amber-400/50"
                }`}
              >
                <div
                  className={`relative h-28 ${
                    isOwner
                      ? "bg-linear-to-br from-emerald-400 via-green-500 to-teal-600"
                      : "bg-linear-to-br from-amber-400 via-orange-500 to-red-500"
                  }`}
                >
                  <div className="absolute bottom-3 left-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lg font-bold text-slate-900 shadow">
                    {shop.name.charAt(0).toUpperCase()}
                  </div>
                  {isOwner && (
                    <span className="absolute right-2 top-2 rounded-full bg-emerald-800 px-2 py-0.5 text-[10px] font-semibold text-emerald-950">
                      Yours
                    </span>
                  )}
                </div>

                <div className="space-y-2 p-4">
                  <h3 className="truncate text-base font-semibold text-white">
                    {shop.name}
                  </h3>
                  <p className="line-clamp-2 text-xs text-slate-400">
                    {shop.description}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1 text-xs text-slate-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="truncate">
                      {shop.location || "Location unavailable"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
