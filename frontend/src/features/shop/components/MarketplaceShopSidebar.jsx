import { useMemo, useState } from "react";

function ChevronIcon({ open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function ShopCategoryGroup({
  category,
  shops,
  expanded,
  isActiveCategory,
  onToggle,
  selectedShopId,
  onSelectShop,
}) {
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between px-2 py-3 text-left text-sm font-medium transition ${
          isActiveCategory ? "text-amber-300" : "text-slate-200 hover:text-amber-300"
        }`}
      >
        <span>{category.name}</span>
        <ChevronIcon open={expanded} />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 px-2 pb-3">
            {shops.length === 0 ? (
              <p className="py-1 text-sm text-slate-500">
                No shops in this category yet.
              </p>
            ) : (
              shops.map((shop) => {
                const active = selectedShopId === shop._id;
                return (
                  <button
                    key={shop._id}
                    type="button"
                    onClick={() => onSelectShop(shop)}
                    className={`rounded-lg px-3 py-1.5 text-left text-sm transition ${
                      active
                        ? "bg-amber-500/15 text-amber-300"
                        : "text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {shop.name}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketplaceShopSidebar({
  shopCategories,
  shops,
  categoriesLoading,
  categoriesError,
  shopsLoading,
  shopsError,
  selectedShopCategoryId,
  onSelectShopCategory,
  selectedShopId,
  onSelectShop,
}) {
  const [panelOpen, setPanelOpen] = useState(true);
  const [shopSearch, setShopSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState(new Set());

  const sortedCategories = useMemo(
    () => [...shopCategories].sort((a, b) => a.name.localeCompare(b.name)),
    [shopCategories],
  );

  const shopsByCategory = useMemo(() => {
    const map = new Map();
    for (const category of sortedCategories) {
      const id = category._id || category.id;
      map.set(
        id,
        shops.filter((shop) => shop.category === id),
      );
    }
    return map;
  }, [sortedCategories, shops]);

  const trimmedSearch = shopSearch.trim().toLowerCase();

  const visibleShopsByCategory = useMemo(() => {
    if (!trimmedSearch) return shopsByCategory;
    const map = new Map();
    for (const [categoryId, categoryShops] of shopsByCategory) {
      map.set(
        categoryId,
        categoryShops.filter((shop) =>
          shop.name.toLowerCase().includes(trimmedSearch),
        ),
      );
    }
    return map;
  }, [shopsByCategory, trimmedSearch]);

  const totalMatches = useMemo(
    () =>
      Array.from(visibleShopsByCategory.values()).reduce(
        (sum, list) => sum + list.length,
        0,
      ),
    [visibleShopsByCategory],
  );

  // Auto-expand every category that has a search match. Derived directly
  // at render time (no effect, no setState-in-effect) — search-driven
  // expansion is just a function of current props/state, not something
  // that needs to be synchronized into its own piece of state.
  const isExpanded = (categoryId) => {
    if (expandedIds.has(categoryId)) return true;
    if (!trimmedSearch) return false;
    return (visibleShopsByCategory.get(categoryId) || []).length > 0;
  };

  const toggleCategory = (categoryId) => {
    const willExpand = !isExpanded(categoryId);

    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });

    // Expanding a category also filters products to that shop category;
    // collapsing the currently-active one clears that filter.
    if (willExpand) {
      onSelectShopCategory(categoryId);
    } else if (selectedShopCategoryId === categoryId) {
      onSelectShopCategory(null);
    }
  };

  const loading = categoriesLoading || shopsLoading;
  const error = categoriesError || shopsError;

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <button
          type="button"
          onClick={() => setPanelOpen((prev) => !prev)}
          className="flex w-full items-center justify-between px-2 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 lg:pointer-events-none"
        >
          <span>Shop categories</span>
          <span className="lg:hidden">
            <ChevronIcon open={panelOpen} />
          </span>
        </button>

        <div className={`${panelOpen ? "block" : "hidden"} mt-3 lg:block`}>
          <input
            type="text"
            value={shopSearch}
            onChange={(e) => setShopSearch(e.target.value)}
            placeholder="Search shops..."
            className="mb-3 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-500/50"
          />

          {loading ? (
            <div className="space-y-2 px-2 py-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 animate-pulse rounded-xl bg-white/5" />
              ))}
            </div>
          ) : error ? (
            <p className="px-2 py-2 text-sm text-red-400">{error}</p>
          ) : sortedCategories.length === 0 ? (
            <p className="px-2 py-2 text-sm text-slate-400">
              No shop categories yet.
            </p>
          ) : trimmedSearch && totalMatches === 0 ? (
            <p className="px-2 py-2 text-sm text-slate-400">No shops found.</p>
          ) : (
            sortedCategories.map((category) => {
              const id = category._id || category.id;
              return (
                <ShopCategoryGroup
                  key={id}
                  category={category}
                  shops={visibleShopsByCategory.get(id) || []}
                  expanded={isExpanded(id)}
                  isActiveCategory={selectedShopCategoryId === id}
                  onToggle={() => toggleCategory(id)}
                  selectedShopId={selectedShopId}
                  onSelectShop={onSelectShop}
                />
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}

export default MarketplaceShopSidebar;
