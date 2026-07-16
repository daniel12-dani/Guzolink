import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useShops } from "../shop.context.js";
import useShopProducts from "../../products/hooks/useShopProducts.js";
import ShopProductCard from "../../products/components/ShopProductCard.jsx";

function ShopProducts() {
  const { shopId } = useParams();
  const { fetchSingleShopDetails, shopError } = useShops();
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const loadShop = async () => {
      const result = await fetchSingleShopDetails(shopId);
      if (result.success) {
        setShop(result.shop);
      }
    };
    loadShop();
  }, [shopId, fetchSingleShopDetails]);

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
          src={shop.posterImage || "https://picsum.photos/200/300?random=1"}
          alt={shop.name}
          className="w-full h-48 object-cover "
          onError={(e) => {
            // Prevents infinite loops if the fallback fails
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placeholder.com/200x300.png?text=No+Image";
          }}
        />
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
      </div>

      <ShopProductCard
        productsLoading={productsLoading}
        productsError={productsError}
        products={products}
        deleteProduct={deleteProduct}
        productCategories={shop.productCategories || []}
      />
    </div>
  );
}

export default ShopProducts;
