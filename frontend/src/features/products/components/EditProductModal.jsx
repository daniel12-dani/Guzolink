// features/products/components/EditProductModal.jsx
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function EditProductModal({
  open,
  product,
  productCategories,
  isUpdating,
  updateError,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });
  const [formError, setFormError] = useState("");
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!product) return;
    setFormData({
      name: product.name ?? "",
      description: product.description ?? "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      category: product.category ?? "",
      image: product.image ?? "",
    });
    setFormError("");
  }, [product]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    cancelButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!formData.name || !formData.price || !formData.stock || !formData.category) {
      setFormError("Please fill out all required fields marked with *.");
      return;
    }
    try {
      await onSave(product.id, formData);
      onClose();
    } catch (err) {
      setFormError(err.message || "An unexpected error occurred while saving.");
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-product-modal-title"
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-800 p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="edit-product-modal-title" className="text-lg font-semibold text-white mb-4">
          Edit Product
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(formError || updateError) && (
            <div className="p-4 rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-sm">
              {formError || updateError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 outline-none focus:border-amber-500"
              required
            >
              <option value="" disabled>Choose a Category</option>
              {productCategories?.map((cat) => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block">Poster Image URL</span>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              ref={cancelButtonRef}
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}