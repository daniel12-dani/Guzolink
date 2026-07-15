import { useState } from "react";
import ConfirmModal from "../../../components/ConfirmModal.jsx";
import EditProductModal from "./EditProductModal.jsx";


function ProductImage({ src, alt }) {
  // Graceful fallback: if there's no image URL, or it fails to load,
  // show a quiet placeholder instead of a broken-image icon.
  if (!src) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-xl bg-slate-900/60 text-slate-600">
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
      className="h-40  w-40 rounded-xl object-cover"
      onError={(e) => {
        // If the URL 404s or is otherwise broken, swap to the same
        // placeholder rather than showing the browser's broken-image icon.
        e.currentTarget.style.display = "none";
        e.currentTarget.nextSibling.style.display = "flex";
      }}
    />
  );
}

export default function ShopProductCard({
  productsLoading,
  productsError,
  products,
  deleteProduct,
  updateProduct,
  isUpdating,
  updateError,
  productCategories,
}) {
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(pendingDelete.id);
      setPendingDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="mb-2 w-full text-lg font-semibold text-white">Products</h3>

      {productsLoading ? (
        <p className="text-slate-300">Loading products...</p>
      ) : productsError ? (
        <p className="text-red-400">{productsError}</p>
      ) : products.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-600 p-8 text-center text-sm text-slate-400">
          No products yet. Create your first one above.
        </p>
      ) : (
        // Fix #4: was `flex flex-row` + fixed `w-54` on each card — that
        // never wraps or shrinks on small screens, cards just overflow
        // horizontally at a fixed width. A responsive grid does.
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => {
            const inStock = (product.stock ?? 0) > 0;
            return (
              <div
                key={product.id}
                className="flex flex-col w-full rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20"
              >
                <div>
                  <div className="relative">
                    {/* was h-40 w-40 (fixed square) — w-full lets it
                        shrink with the card instead of overflowing it */}
                    <ProductImage src={product.image} alt={product.name} />
                    <div
                      style={{ display: "none" }}
                      className="absolute inset-0 hidden items-center justify-center rounded-xl bg-slate-900/60 text-slate-600"
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

                   <span
                      className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        inStock ? "bg-emerald-500/90 text-emerald-950" : "bg-red-500/90 text-red-950"
                      }`}
                    >
                      {inStock ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </div>

                  <h4 className="mt-3 text-lg font-semibold text-white">{product.name}</h4>
                  <p className="mb-2 text-sm text-slate-400">
                    <span className="font-semibold text-amber-400">${product.price}</span>
                  </p>
                  <p className="mb-4 line-clamp-2 text-sm text-slate-300">{product.description}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-sm font-medium text-amber-300 transition hover:bg-amber-500/40"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setPendingDelete(product)}
                    className="rounded-lg bg-red-500/20 px-3 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-500/40"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

     <ConfirmModal
        open={!!pendingDelete}
        title="Delete this product?"
        message={pendingDelete ? `"${pendingDelete.name}" will be permanently removed. This can't be undone.` : ""}
        confirmLabel="Delete"
        isDangerous
        isConfirming={isDeleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Rendered once, outside the map — was the structural bug */}
      <EditProductModal
        open={!!editingProduct}
        product={editingProduct}
        productCategories={productCategories}
        isUpdating={isUpdating}
        updateError={updateError}
        onClose={() => setEditingProduct(null)}
        onSave={updateProduct}
      />
    </div>
    
  );
}
