import { Link } from "react-router-dom";
import ShopCard from "../components/ShopCard.jsx";
import { useShops } from "../shop.context.js";

function MyShops() {
  const { shops, shopError, isLoading, isRefreshing, fetchShops, deleteShop } =
    useShops();

  // Full-page loading state — only true on a genuinely empty first load
  // (see ShopContext: cache-first means this almost never fires on a
  // return visit, only the very first time a merchant ever lands here).
  console.log("Fetched shops", shops);
  if (isLoading) {
    return (
      <p className="text-red-600 rounded-2xl text-center font-bold mb-4 border border-red-500 p-5">
        Loading your shops...
      </p>
    );
  }

  if (shopError) {
    return (
      <p className="text-red-600 rounded-2xl text-center font-bold mb-4 border border-red-500 p-5">
        Couldn't load shops: {shopError}
      </p>
    );
  }

  return (
    <div className="mx-auto p-6 sm:px-6 lg:px-8 rounded 3xl border border-white/10 bg-slate-800 shadow-sm transform transition-all duration-300 hover:scale-[1.01]">
      <div className="p-3 space-x-12 sm:space-x-3 sm:flex sm:flex-wrap ">
        {shopError && (
          <p className="text-red-600 rounded-2xl text-center font-bold mb-4 border border-red-500 p-5">
            {shopError}
          </p>
        )}
        <Link
          to={"/"}
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition mb-2 mt-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to home
        </Link>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4 mt-6">
          <Link
            to="/shop/create"
            className="inline-flex items-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-400 transition"
          >
            + Add New Shop
          </Link>

          {/* Manual refresh — this is the "merchant just made a sale,
              pull the latest numbers" button. It calls fetchShops with
              silent: true, which drives isRefreshing instead of isLoading,
              so the existing shop cards stay on screen the whole time
              instead of being replaced by a full-page spinner. */}
          <button
            type="button"
            onClick={() => fetchShops({ silent: true })}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {!shops || shops.length === 0 ? (
            <p className="text-red-600 rounded-2xl text-center font-bold mb-4 border border-red-500 p-5">
              You have no shops yet .
            </p>
          ) : (
            shops.map((shop) => (
              <ShopCard key={shop._id} shop={shop} onDelete={deleteShop} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MyShops;
