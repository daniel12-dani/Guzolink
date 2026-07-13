import { Link } from "react-router-dom";

// STUB — this needs a real backend query before it's live.
//
// ShopContext's fetchShops() hits /api/shops, but that's scoped to
// MyShops.jsx (the logged-in merchant's OWN shops) — it's not a public
// "browse every shop" list. This section needs a genuinely different,
// unfiltered endpoint (or GraphQL query, matching the pattern you used
// for products: getAllShopProducts = everyone's, getShopProducts = one
// shop's). Swap MOCK_SHOPS below for that once it exists.
//
// Also worth deciding before wiring this up: where should a shop card
// link TO? /shop/:id currently points at ShopDashboard, which is the
// MERCHANT's management view (create/delete products) — not something
// a random visitor should land on. You'll likely want a separate public
// storefront route, e.g. /store/:shopId, showing just that shop's
// products with no edit controls.
const MOCK_SHOPS = [
  { id: "1", name: "Selam Textiles", location: "Bole, Addis Ababa" },
  { id: "2", name: "Habesha Leather Co.", location: "Piassa, Addis Ababa" },
  { id: "3", name: "Merkato Electronics", location: "Merkato, Addis Ababa" },
];

export default function ShopsStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
            Featured shops
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            Meet the merchants
          </h2>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MOCK_SHOPS.map((shop) => (
          <Link
            key={shop.id}
            to={`/store/${shop.id}`} // proposed public storefront route — doesn't exist yet
            className="flex w-64 shrink-0 flex-col rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-white/20"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-lg font-bold text-amber-300">
              {shop.name.charAt(0)}
            </div>
            <h3 className="text-lg font-semibold text-white">{shop.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{shop.location}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}