import { useCart } from "../../cart/cart.context.js";
import { Link } from "react-router-dom";
function ProductImage({ src, alt }) {
  const getImageUrl = (imagePath) => {
     if (!imagePath) return null;
     const backendUrl = import.meta.env.VITE_API_URL || "";
     return `${backendUrl}${imagePath}`;
   };
 
   const resolvedSrc = getImageUrl(src);
 
   if (!resolvedSrc) {
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
      src={resolvedSrc}
      alt={alt}
      className="h-40 w-full rounded-2xl object-cover"
      onError={(e) => {
        e.currentTarget.style.display = "none";
        e.currentTarget.nextSibling.style.display = "flex";
      }}
    />
  );
}

function RatingStars({ rating }) {
  // No `rating` field exists on products in the backend schema today —
  // this only renders once a product actually carries one (e.g. after
  // reviews ship), so we never fabricate a number.
  if (rating === undefined || rating === null) return null;

  const rounded = Math.round(rating);
  return (
    <div
      className="flex items-center gap-1 text-amber-400"
      title={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={i < rounded ? "currentColor" : "none"}
          stroke="currentColor"
          className="h-3.5 w-3.5"
        >
          <path
            strokeWidth={1.2}
            d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.9l-5.21 2.74 1-5.8-4.21-4.1 5.82-.85z"
          />
        </svg>
      ))}
      <span className="ml-1 text-xs text-slate-400">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductListingCard({ product, shopName }) {
  const { addToCart } = useCart();
  const stock = product.stock ?? 0;
  const inStock = stock > 0;
  const lowStock = inStock && stock <= 5;

  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm transition hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-black/20">
      <div className="relative mb-4">
        <ProductImage src={product.image} alt={product.name} />
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
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
        {product.category?.name || product.category}
      </p>

      <h3 className="mt-1 text-xl font-semibold text-white">{product.name}</h3>

      {shopName && (
        <p className="mt-1 text-sm text-slate-400">
          Sold by <span className="text-slate-300">{shopName}</span>
        </p>
      )}

      <div className="mt-2">
        <RatingStars rating={product.rating} />
      </div>

      <p className="mt-2 flex-1 text-sm text-slate-300 line-clamp-2">
        {product.description}
      </p>

      <p
        className={`mt-2 text-xs font-medium ${
          inStock
            ? lowStock
              ? "text-amber-400"
              : "text-emerald-400"
            : "text-red-400"
        }`}
      >
        {inStock
          ? lowStock
            ? `Only ${stock} left`
            : "In stock"
          : "Out of stock"}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-amber-400">
          ${product.price}
        </span>
        <div className="flex gap-2">
          {/* <Link
            to={`/products/${product.id}`}
            className="rounded-full border border-slate-600 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
          >
            View details
          </Link> 
          <button
            onClick={() => addToCart(product)}
            disabled={!inStock}
            className="rounded-full bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {inStock ? "Add to cart" : "Sold out"}
          </button>
        </div>
      </div>
    </article>
  );
}
