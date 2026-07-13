import { Link } from "react-router-dom";
import useProductCategories from "../hooks/useProductCategories.js";

export default function CategoryStrip() {
  const { categories, loading, error } = useProductCategories();

  if (loading || error || categories.length === 0) return null; // quiet on empty/error — not critical to the page

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
        Shop by category
      </p>
      <div className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <Link
            key={category.id || category._id}
            to={`/products?category=${category.id || category._id}`}
            className="flex shrink-0 items-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}