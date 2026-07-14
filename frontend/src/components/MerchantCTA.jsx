import { Link } from "react-router-dom";

export default function MerchantCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 to-transparent p-10 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
            For merchants
          </p>
          <h2 className="mt-2 max-w-md text-3xl font-bold text-white">
            Open your shop, reach more customers
          </h2>
          <p className="mt-3 max-w-md text-slate-300">
            Set up your storefront and start listing products in minutes — no
            fees to get started.
          </p>
        </div>
        <Link
          to="/shop/create"
          className="shrink-0 rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-amber-400"
        >
          Create your shop
        </Link>
      </div>
    </section>
  );
}
