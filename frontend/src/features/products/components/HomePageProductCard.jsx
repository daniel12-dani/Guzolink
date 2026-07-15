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
    <article className="group overflow-hidden justify-items-center flex-col rounded-3xl border border-white/10 bg-white/5 p-3 shadow-sm transition hover:-translate-y-1 hover:border-white/20 hover:shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        {product.badge ? (
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            {product.badge}
          </span>
        ) : (
          <span />
        )}
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
          <span className="absolute right-2 top-2 rounded-full bg-red-500/90 px-2 py-1 text-xs font-semibold text-white">
            Out of Stock
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-white line-clamp-2">
        {product.name}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-6 text-slate-300 line-clamp-3">
        {product.description}
      </p>

      <div className="mt-auto pt-4">
        <div className="mb-3">
          <span className="text-lg font-semibold text-amber-400">
            ${product.price}
          </span>
        </div>

        {inStock ? (
          <div className="flex gap-2">
            <Link
              to={`/products/${product.id}`}
              className="flex flex-1 items-center justify-center rounded-full border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              Details
            </Link>

            <button
              onClick={() => addToCart(product)}
              className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400"
            >
              Add
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              to={`/products/${product.id}`}
              className="flex items-center justify-center rounded-full border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              Details
            </Link>

            <div className="w-full rounded-full bg-red-500 py-2 text-center text-sm font-semibold uppercase tracking-wide text-white">
              Sold Out
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
