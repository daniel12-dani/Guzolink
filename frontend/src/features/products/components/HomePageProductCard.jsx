import { Link } from "react-router-dom";
import { useCart } from "../../cart/cart.context.js";

function ProductImage({ src, alt }) {
  if (!src) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-slate-900/60 text-slate-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
        </svg>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="aspect-square w-full rounded-lg object-cover"
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
  // console.log("product", product);
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2 transition hover:-translate-y-0.5 hover:border-white/20">
      <Link to={`/products/${product.id}`} className="relative block">
        <ProductImage src={product.image} alt={product.name} />
        <div
          style={{ display: "none" }}
          className="absolute inset-0 hidden items-center justify-center rounded-lg bg-slate-900/60 text-slate-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
          </svg>
        </div>
        {!inStock && (
          <span className="absolute right-1 top-1 rounded bg-red-500/90 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Sold out
          </span>
        )}
      </Link>

      <Link to={`/products/${product.id}`} className="mt-2 line-clamp-2 min-h-10 text-sm text-slate-200 hover:text-white">
        {product.name}
      </Link>

      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-base font-bold text-amber-400">${product.price}</span>
        {inStock && (
          <button
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-slate-900 transition hover:bg-amber-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>
    </article>
  );
}