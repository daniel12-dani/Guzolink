import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";

function Products() {
  const { products, loading, error } = useProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">Shop All</p>
        <h1 className="text-3xl font-bold text-white">Discover the essentials</h1>
        <p className="max-w-2xl text-slate-300">
          Browse our collection of products from various shops.
        </p>
      </div>

      {loading ? (
        <p className="text-white">Loading products...</p>
      ) : error ? (
        <p className="text-red-400">{error.message}</p>
      ) : products.length === 0 ? (
        <p className="text-slate-300">No products available at the moment.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
