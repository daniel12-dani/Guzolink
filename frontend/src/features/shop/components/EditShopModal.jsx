import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useCategories } from "../../categories/category.context.js";

export default function EditShopModal({
  open,
  shop,
  isUpdating,
  updateError,
  onClose,
  onSave,
}) {
  const {
    shopCategories = [],
    createShopCategory,
    creatingCategory,
  } = useCategories();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contact: "",
    category: "",
    location: "",
    posterimage: "",
  });
  const [formError, setFormError] = useState("");
  const cancelButtonRef = useRef(null);
  const fileInputRef = useRef(null);
  const [posterImageFile, setPosterImageFile] = useState(null);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const ADD_NEW_VALUE = "__add_new__";

  useEffect(() => {
    if (!shop) return;
    // eslint-disable-next-line
    setFormData({
      name: shop.name ?? "",
      description: shop.description ?? "",
      contact: shop.contact ?? "",
      category: shop.category?._id ?? shop.category ?? "",
      location: shop.location ?? "",
      posterimage: shop.posterimage ?? "",
    });
    setPosterImageFile(null);
    setFormError("");
    setIsAddingCategory(false);
    setNewCategoryName("");
    setCategoryError("");
  }, [shop]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    cancelButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !shop) return null;

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

  const handleCreateCategory = async () => {
    setCategoryError("");
    try {
      const created = await createShopCategory(newCategoryName);
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
    if (!formData.name || !formData.contact) {
      setFormError("Name and contact are required.");
      return;
    }
    try {
      await onSave(shop._id, { ...formData, posterImageFile });
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
        aria-labelledby="edit-shop-modal-title"
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-800 p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="edit-shop-modal-title"
          className="text-lg font-semibold text-white mb-4"
        >
          Edit Shop
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(formError || updateError) && (
            <div className="p-4 rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-sm">
              {formError || updateError}
            </div>
          )}

          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">
              Shop name <span className="text-red-500">*</span>
            </span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              required
            />
          </label>

          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Description</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none resize-none"
            />
          </label>

          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">
              Contact <span className="text-red-500">*</span>
            </span>
            <input
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              required
            />
          </label>

          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Category</span>
            {!isAddingCategory ? (
              <select
                name="category"
                value={formData.category}
                onChange={handleCategorySelectChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {shopCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
                <option value={ADD_NEW_VALUE} className="text-amber-400">
                  + Add new category
                </option>
              </select>
            ) : (
              <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-800 p-3">
                <input
                  type="text"
                  autoFocus
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none"
                  disabled={creatingCategory}
                />
                {categoryError && (
                  <p className="text-xs text-rose-400">{categoryError}</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={creatingCategory || !newCategoryName.trim()}
                    className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {creatingCategory ? "Adding..." : "Add category"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelAddCategory}
                    disabled={creatingCategory}
                    className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </label>

          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Location</span>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block">Poster Image URL</span>
              <input
                type="text"
                name="posterimage"
                value={formData.posterimage}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
                placeholder="https://example.com/image.jpg"
                disabled={!!posterImageFile}
              />
            </label>
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block">Upload New Poster Image</span>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) =>
                  setPosterImageFile(e.target.files?.[0] ?? null)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
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
