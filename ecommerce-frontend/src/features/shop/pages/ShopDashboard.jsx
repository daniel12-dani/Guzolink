import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useShops } from "../shop.context.js";
import { useAuth } from "../../../features/auth/auth.context.js";
import useShopProducts from "../../products/hooks/useShopProducts.js";
import ProductCard from "../../../features/products/components/ShopProductCard.jsx";

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
    error: productsError,
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

        {/* creating new product */}
        <Link
          to={`/shop/${shopId}/product/create`}
          className="inline-flex items-center rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-400 transition"
        >
          + Add Product
        </Link>
      </div>

      <ProductCard
        productsLoading={productsLoading}
        productsError={productsError}
        products={products}
        deleteProduct={deleteProduct}
      />
    </div>
  );
}

export default ShopDashboard;
