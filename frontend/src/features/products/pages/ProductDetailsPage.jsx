import { Link, useParams } from "react-router-dom";
import useProducts from "../hooks/useProducts.js";
import { useCart } from "../../cart/cart.context.js";

function ProductDetails() {
  const { id } = useParams();
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  
  if (loading) return <div className="p-16 text-center text-white">Loading...</div>;
  if (error) return <div className="p-16 text-center text-red-400">{error.message}</div>;

  const product = products.find((item) => String(item._id || item.id) === String(id));

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Product not found</h1>
        <Link to="/products" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 font-semibold text-white">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="rounded-2xl bg-slate-100 p-16 text-center text-6xl">
            {product.name === "Aurora Headphones" ? "🎧" : product.name === "Luma Smart Watch" ? "⌚" : product.name === "Nova Laptop Stand" ? "💻" : product.name === "Pulse Bluetooth Speaker" ? "🔊" : product.name === "Glide Backpack" ? "🎒" : "📷"}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">Product details</p>
          <h1 className="text-4xl font-bold text-slate-900">{product.name}</h1>
          <p className="text-lg text-slate-600">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <div><span className="block text-slate-500">Category</span>{product.category?.name || product.category}</div>
            <div><span className="block text-slate-500">Price</span>${product.price}</div>
            <div><span className="block text-slate-500">Stock</span>{product.stock}</div>
            <div><span className="block text-slate-500">Badge</span>{product.badge}</div>
          </div>

          <button onClick={() => addToCart(product)} className="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400">
            Add to cart
          </button>
          <Link to="/products" className="inline-flex rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700">
            Back to products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
