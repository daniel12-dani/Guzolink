import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useShops } from "../shop.context.js";
import { useAuth } from "../../../features/auth/auth.context.js";
import useShopProducts from "../../products/hooks/useShopProducts.js";
import ShopProductCard from "../../../features/products/components/ShopProductCard.jsx";

function RefreshIcon({ spinning }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-4 w-4 ${spinning ? "animate-spin" : ""}`}
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
  );
}

function ShopDashboard() {
  const { shopId } = useParams();
  const { user } = useAuth();
  const { fetchSingleShop, shopError } = useShops();
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const loadShop = async () => {
      const result = await fetchSingleShop(shopId);
      if (result.success) {
        setShop(result.shop);
      }
    };
    loadShop();
  }, [shopId, fetchSingleShop]);

  const {
    products,
    loading: productsLoading,
    isRefreshing,
    error: productsError,
    fetchProducts, // the silent-refetch wrapper from useShopProducts
    deleteProduct,
  } = useShopProducts(shopId);

  if (shopError) return <p className="p-6 text-red-600">{shopError}</p>;
  if (!shop) return <p className="p-6 text-white">Loading…</p>;

  return (
    <div className="mx-auto p-6 sm:px-6 lg:px-8 rounded 3xl border border-white/10 bg-slate-800 shadow-sm">
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <img
          src={shop.posterimage || "https://picsum.photos/200/300?random=1"}
          alt={shop.name}
          className="w-full h-48 object-cover "
          onError={(e) => {
            // Prevents infinite loops if the fallback fails
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placeholder.com/200x300.png?text=No+Image";
          }}
        />
        <Link
          to={`/profile/${user.id}`}
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
          Back to shops
        </Link>
        {/* Shop Details */}
        <div className="p-4 mt-4 mb-4 rounded-2xl bg-white/10 backdrop-blur border-t border-white/10">
          <h3 className="text-xl font-semibold text-white">{shop.name}</h3>
          {shop.location && (
            <p className="text-sm text-slate-300">{shop.location}</p>
          )}
          {shop.contact && (
            <p className="text-sm font-medium text-amber-400 mt-1">
              {shop.contact}
            </p>
          )}
        </div>

        {/* Page-level actions: creating a product and refreshing this
            shop's product list both belong here, not inside
            ShopProductCard — that component just renders whatever
            products it's given, it shouldn't own the fetch action. */}
        <div className="flex items-center gap-3">
          <Link
            to={`/shop/${shopId}/product/create`}
            className="inline-flex items-center rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-400 transition"
          >
            + Add Product
          </Link>

          <button
            type="button"
            onClick={fetchProducts}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshIcon spinning={isRefreshing} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <ShopProductCard
        productsLoading={productsLoading}
        productsError={productsError}
        products={products}
        deleteProduct={deleteProduct}
      />
    </div>
  );
}

export default ShopDashboard;
