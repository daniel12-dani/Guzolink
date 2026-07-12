import { Link } from "react-router-dom";
import { useCart } from "../../cart/cart.context";

export default function HomePageProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
          {product.badge}
        </span>
        <span className="text-sm text-slate-500">{product.category?.name || product.category}</span>
      </div>

      <div className="mb-4 rounded-2xl bg-slate-100 p-8 text-center text-4xl">
        {product.name === "Aurora Headphones" ? "🎧" : product.name === "Luma Smart Watch" ? "⌚" : product.name === "Nova Laptop Stand" ? "💻" : product.name === "Pulse Bluetooth Speaker" ? "🔊" : product.name === "Glide Backpack" ? "🎒" : "📷"}
      </div>

      <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
      <p className="mt-2 flex-1 text-sm text-slate-600">{product.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-slate-900">${product.price}</span>
        <div className="flex gap-2">
          <Link to={`/products/${product.id}`} className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
            Details
          </Link>
          <button onClick={() => addToCart(product)} className="rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white">
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

