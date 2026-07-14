import { Link } from "react-router-dom";
import { useCart } from "../../cart/cart.context.js";

function ProductImage({ src, alt }) {
  if (!src) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-slate-900/60 text-slate-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-40 w-full rounded-2xl object-cover"
      onError={(e) => {
        e.currentTarget.style.display = "none";
        e.currentTarget.nextSibling.style.display = "flex";
      }}
    />
  );
}

export default function HomePageProductCard({ product }) {
  const { addToCart } = useCart();
  const inStock = (product.stock ?? 0) > 0;

  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm transition hover:-translate-y-1 hover:border-white/20 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        {product.badge ? (
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            {product.badge}
          </span>
        ) : (
          <span />
        )}
        <span className="text-sm text-slate-400">
          {product.category?.name || product.category}
        </span>
      </div>

      <div className="relative mb-4">
        <ProductImage src={product.image} alt={product.name} />
        {/* Fallback shown by ProductImage's onError if the URL is broken */}
        <div
          style={{ display: "none" }}
          className="absolute inset-0 hidden items-center justify-center rounded-2xl bg-slate-900/60 text-slate-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
            />
          </svg>
        </div>

        {!inStock && (
          <span className="absolute right-2 top-2 rounded-full bg-red-500/90 px-2 py-0.5 text-xs font-semibold text-red-950">
            Out of stock
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold text-white">{product.name}</h3>
      <p className="mt-2 flex-1 text-sm text-slate-300 line-clamp-2">
        {product.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-amber-400">
          ${product.price}
        </span>
        <div className="flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="rounded-full border border-slate-600 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
          >
            Details
          </Link>
          <button
            onClick={() => addToCart(product)}
            disabled={!inStock}
            className="rounded-full bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {inStock ? "Add" : "Sold out"}
          </button>
        </div>
      </div>
    </article>
  );
}
