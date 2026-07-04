import { Link, useParams } from "react-router-dom";
import { useProducts } from "../context/products";

function ProductDetails() {
  const { id } = useParams();
  const { products, addToCart } = useProducts();
  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return <div className="px-4 py-20 text-center text-slate-600">Product not found.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl bg-slate-100 p-10 text-center text-6xl">{product.name === "Aurora Headphones" ? "🎧" : product.name === "Luma Smart Watch" ? "⌚" : product.name === "Nova Laptop Stand" ? "💻" : product.name === "Pulse Bluetooth Speaker" ? "🔊" : product.name === "Glide Backpack" ? "🎒" : "📷"}</div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">{product.category}</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">{product.name}</h1>
          <p className="mt-4 text-lg text-slate-600">{product.description}</p>
          <div className="mt-6 flex items-center gap-4">
            <span className="text-3xl font-bold text-slate-900">${product.price}</span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">{product.badge}</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => addToCart(product)} className="rounded-full bg-slate-900 px-5 py-3 font-semibold text-white">
              Add to cart
            </button>
            <Link to="/products" className="rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700">
              Back to shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
