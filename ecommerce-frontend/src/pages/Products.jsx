import ProductCart from "../components/productCart";
import { useProducts } from "../context/products";

function Products() {
  const { products } = useProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">Shop</p>
        <h1 className="text-3xl font-bold text-slate-900">Discover the essentials</h1>
        <p className="max-w-2xl text-slate-600">
          Browse a stylish collection of everyday electronics and lifestyle staples.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCart key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;
