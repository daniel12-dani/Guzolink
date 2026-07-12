export default function ShopProductCard({
  productsLoading,
  productsError,
  products,
  deleteProduct,
}) {
  return (
    <div className="mt-8">
      {productsLoading ? (
        <p className="text-slate-300">Loading products...</p>
      ) : productsError ? (
        <p className="text-red-400">{productsError}</p>
      ) : products.length === 0 ? (
        <p className="text-red-600 rounded-2xl text-center font-bold mb-4 border border-red-500 p-5">
          No products found. Create your first product above!
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-lg font-semibold text-white">
                  {product.name}
                </h4>
                <p className="text-sm text-slate-400 mb-2">
                  {product.category?.name || product.category} • $
                  {product.price}
                </p>
                <p className="text-sm text-slate-300 line-clamp-2 mb-4">
                  {product.description}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="rounded-lg bg-red-500/20 px-3 py-1.5 text-sm font-medium text-red-300 hover:bg-red-500/40 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
