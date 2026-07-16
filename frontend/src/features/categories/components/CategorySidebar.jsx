function CategorySidebar({
  categories,
  selectedId,
  onSelect,
  loading,
  error,
}) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <h2 className="mb-3 px-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Categories
        </h2>

        {loading ? (
          <div className="space-y-2 px-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-8 animate-pulse rounded-xl bg-white/5"
              />
            ))}
          </div>
        ) : error ? (
          <p className="px-2 text-sm text-red-400">{error}</p>
        ) : (
          <nav className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => onSelect(null)}
              className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                selectedId === null
                  ? "border-l-2 border-amber-500 bg-amber-500/15 text-amber-300"
                  : "border-l-2 border-transparent text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              All products
            </button>

            {categories.length === 0 ? (
              <p className="px-3 py-2 text-sm text-slate-400">
                No categories yet.
              </p>
            ) : (
              categories.map((category) => {
                const id = category.id || category._id;
                const active = selectedId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onSelect(id)}
                    className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                      active
                        ? "border-l-2 border-amber-500 bg-amber-500/15 text-amber-300"
                        : "border-l-2 border-transparent text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })
            )}
          </nav>
        )}
      </div>
    </aside>
  );
}

export default CategorySidebar;
