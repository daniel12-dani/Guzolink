import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useCategories } from "../../categories/category.context.js";
import uploadProductImage from "../utils/UploadProductImage.js";

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
    name: "", description: "", price: "", stock: "", category: "", image: "",
  });
  const [formError, setFormError] = useState("");
  const cancelButtonRef = useRef(null);
  const fileInputRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // category-add logic, replicated from CreateProductCard
  const { createProductCategory, creatingProductCategory } = useCategories();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const ADD_NEW_VALUE = "__add_new__";

  useEffect(() => {
    if (!product) return;
    // eslint-disable-next-line 
    setFormData({
      name: product.name ?? "",
      description: product.description ?? "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      category: product.category ?? "",
      image: product.image ?? "",
    });
    setImageFile(null);
    setFormError("");
    setIsAddingCategory(false);
    setNewCategoryName("");
    setCategoryError("");
  }, [product]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKeyDown);
    cancelButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelectChange = (e) => {
    if (e.target.value === ADD_NEW_VALUE) {
      setIsAddingCategory(true);
      setCategoryError("");
      return;
    }
    handleChange(e);
  };

  const handleCreateProductCategory = async () => {
    setCategoryError("");
    try {
      const created = await createProductCategory(newCategoryName);
      setFormData((prev) => ({ ...prev, category: created._id }));
      setNewCategoryName("");
      setIsAddingCategory(false);
    } catch (err) {
      setCategoryError(err.message || "Failed to create category");
    }
  };

  const handleCancelAddCategory = () => {
    setIsAddingCategory(false);
    setNewCategoryName("");
    setCategoryError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!formData.name || !formData.price || !formData.stock || !formData.category) {
      setFormError("Please fill out all required fields marked with *.");
      return;
    }
    try {
      let image = formData.image;
      if (imageFile) {
        setIsUploadingImage(true);
        image = await uploadProductImage(imageFile);
        setIsUploadingImage(false);
      }
      await onSave(product.id, { ...formData, image });
      onClose();
    } catch (err) {
      setIsUploadingImage(false);
      setFormError(err.message || "An unexpected error occurred while saving.");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose} role="presentation">
      <div
        role="dialog" aria-modal="true" aria-labelledby="edit-product-modal-title"
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-800 p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="edit-product-modal-title" className="text-lg font-semibold text-white mb-4">Edit Product</h3>

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
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 outline-none focus:border-amber-500" required />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 outline-none focus:border-amber-500 resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input type="number" name="price" step="0.01" min="0" value={formData.price} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 outline-none focus:border-amber-500" required />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Stock <span className="text-red-500">*</span>
              </label>
              <input type="number" name="stock" min="0" value={formData.stock} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 outline-none focus:border-amber-500" required />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block">
                Category <span className="text-red-500">*</span>
              </span>
              {!isAddingCategory ? (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategorySelectChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 outline-none focus:border-amber-500"
                  required
                >
                  <option value="" disabled>Choose a Category</option>
                  {productCategories?.map((cat) => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                  ))}
                  <option value={ADD_NEW_VALUE} className="text-amber-400">+ Add new category</option>
                </select>
              ) : (
                <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-800 p-3">
                  <input
                    type="text" autoFocus value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none"
                    disabled={creatingProductCategory}
                  />
                  {categoryError && <p className="text-xs text-rose-400">{categoryError}</p>}
                  <div className="flex gap-2">
                    <button type="button" onClick={handleCreateProductCategory}
                      disabled={creatingProductCategory || !newCategoryName.trim()}
                      className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50">
                      {creatingProductCategory ? "Adding..." : "Add category"}
                    </button>
                    <button type="button" onClick={handleCancelAddCategory} disabled={creatingProductCategory}
                      className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700 disabled:opacity-50">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block">Poster Image URL</span>
              <input
                type="text" name="image" value={formData.image} onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
                placeholder="https://example.com/image.jpg"
                disabled={!!imageFile}
              />
            </label>
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block">Upload New Poster Image</span>
              <input
                type="file" ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button ref={cancelButtonRef} type="button" onClick={onClose}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700">
              Cancel
            </button>
            <button type="submit" disabled={isUpdating || isUploadingImage}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50">
              {isUploadingImage ? "Uploading..." : isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}