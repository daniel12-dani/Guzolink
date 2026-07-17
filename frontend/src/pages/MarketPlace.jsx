import { useMemo, useState } from "react";
import useProducts from "../features/products/hooks/useProducts.js";
import useShopProducts from "../features/products/hooks/useShopProducts.js";
import ProductListingCard from "../features/products/components/ProductListingCard.jsx";
import { useCategories } from "../features/categories/category.context.js";
import CategorySidebar from "../features/categories/components/CategorySidebar.jsx";
import { useShops } from "../features/shop/shop.context.js";
import MarketplaceShopSidebar from "../features/shop/components/MarketplaceShopSidebar.jsx";

function Marketplace() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedShopCategoryId, setSelectedShopCategoryId] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null); // { _id, name } | null
  const [searchTerm, setSearchTerm] = useState("");

  const {
    productCategories,
    shopCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const { shops, isLoading: shopsLoading, shopError } = useShops();
  console.log(
    "Marketplace shops:",
    shops,
    "Loading:",
    shopsLoading,
    "Error:",
    shopError,
    "shopsCategories:",
    shopCategories,
  );
  // Full catalog — used whenever no specific shop is selected.
  const {
    products: allProducts,
    loading: allLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    error: allError,
  } = useProducts();

  // One shop's products — real existing hook, only fetches once a shop
  // is actually selected (see useShopProducts.js: `skip: !shopId`).
  const {
    products: shopProducts,
    loading: shopLoading,
    error: shopProductsError,
  } = useShopProducts(selectedShop?._id);

  const usingShopScope = !!selectedShop;
  const baseProducts = usingShopScope ? shopProducts : allProducts;
  const loading = usingShopScope ? shopLoading : allLoading;
  const error = usingShopScope ? shopProductsError : allError;

  const sortedProductCategories = useMemo(
    () => [...productCategories].sort((a, b) => a.name.localeCompare(b.name)),
    [productCategories],
  );

  // Real shop-id -> shop-name lookup for cards, built from the actual
  // shops list (no hardcoded names).
  const shopNameById = useMemo(() => {
    const map = new Map();
    for (const shop of shops) map.set(shop._id, shop.name);
    return map;
  }, [shops]);

  // Shop ids belonging to the selected shop category, for filtering the
  // full product list when a category (not a single shop) is active.
  const shopIdsInSelectedCategory = useMemo(() => {
    if (!selectedShopCategoryId) return null;
    return new Set(
      shops
        .filter((shop) => shop.category === selectedShopCategoryId)
        .map((shop) => shop._id),
    );
  }, [shops, selectedShopCategoryId]);

  const trimmedSearch = searchTerm.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    return baseProducts.filter((product) => {
      const productCategoryId = product.category?.id || product.category;
      const matchesCategory =
        !selectedCategoryId || productCategoryId === selectedCategoryId;

      const matchesShopCategory =
        usingShopScope || // already scoped to one shop, category filter is redundant
        !shopIdsInSelectedCategory ||
        shopIdsInSelectedCategory.has(product.shop);

      const matchesSearch =
        !trimmedSearch ||
        product.name?.toLowerCase().includes(trimmedSearch) ||
        product.description?.toLowerCase().includes(trimmedSearch);

      return matchesCategory && matchesShopCategory && matchesSearch;
    });
  }, [
    baseProducts,
    selectedCategoryId,
    shopIdsInSelectedCategory,
    usingShopScope,
    trimmedSearch,
  ]);

  const hasActiveFilters =
    !!selectedCategoryId ||
    !!selectedShopCategoryId ||
    !!selectedShop ||
    !!trimmedSearch;

  const clearFilters = () => {
    setSelectedCategoryId(null);
    setSelectedShopCategoryId(null);
    setSelectedShop(null);
    setSearchTerm("");
  };

  return (
    <div className="px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 max-w-2xl space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            Marketplace
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Every shop, every product, one place to browse
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr_280px] xl:grid-cols-[240px_1fr_300px]">
          {/* Left — product categories */}
          <CategorySidebar
            categories={sortedProductCategories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
            loading={categoriesLoading}
            error={categoriesError}
          />

          {/* Center — search + products */}
          <section className="min-w-0">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35m0 0a7 7 0 10-9.9-9.9 7 7 0 009.9 9.9z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-full border border-white/10 bg-slate-900 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-500/50"
                />
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="shrink-0 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Clear filters
                </button>
              )}
            </div>

            {selectedShop && (
              <h2 className="mb-4 text-xl font-bold text-white">
                {selectedShop.name}
              </h2>
            )}

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/5"
                  />
                ))}
              </div>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 p-12 text-center">
                <p className="text-lg font-semibold text-white">
                  No products found
                </p>
                <p className="mt-1 text-slate-400">
                  Try a different search term or filter, or clear filters to see
                  everything.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductListingCard
                      key={product.id}
                      product={product}
                      shopName={
                        selectedShop?.name || shopNameById.get(product.shop)
                      }
                    />
                  ))}
                </div>

                {!usingShopScope &&
                  hasMore &&
                  !selectedCategoryId &&
                  !selectedShopCategoryId &&
                  !trimmedSearch && (
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

          {/* Right — shop categories & shops */}
          <MarketplaceShopSidebar
            shopCategories={shopCategories}
            shops={shops}
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
            shopsLoading={shopsLoading}
            shopsError={shopError}
            selectedShopCategoryId={selectedShopCategoryId}
            onSelectShopCategory={setSelectedShopCategoryId}
            selectedShopId={selectedShop?._id}
            onSelectShop={(shop) =>
              setSelectedShop((prev) => (prev?._id === shop._id ? null : shop))
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Marketplace;
