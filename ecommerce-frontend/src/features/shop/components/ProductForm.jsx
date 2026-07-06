import React from "react";
import { useProductForm } from "../hooks/useProductForm";

function ProductForm({ onAddItem, shop }) {
  const {
    formData,
    setFormData,
    message,
    filteredCategories,
    sizeOptions,
    sizeLabel,
    colorLabel,
    colorPlaceholder,
    handleChange,
    toggleSize,
    handleSubmit,
  } = useProductForm({ shop, onAddItem });

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Item form</h2>
      <p className="mt-2 text-sm text-slate-600">
        Add products with detailed metadata (size, price, color, SKU, image, tags).
      </p>

      {message ? (
        <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm text-slate-600">
            <span className="mb-2 block">Item name</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              required
            />
          </label>

          <label className="block text-sm text-slate-600">
            <span className="mb-2 block">Price</span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              required
              min="0"
              step="0.01"
            />
          </label>

          <label className="block text-sm text-slate-600">
            <span className="mb-2 block">Category</span>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            >
              {filteredCategories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-slate-600">
            <span className="mb-2 block">{colorLabel}</span>
            <input
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              placeholder={colorPlaceholder}
            />
          </label>
        </div>

        <label className="block text-sm text-slate-600">
          <span className="mb-2 block">Image URL</span>
          <input
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            placeholder="https://example.com/image.jpg"
          />
        </label>

        {sizeOptions.length > 0 && (
          <div className="space-y-2">
            <span className="block text-sm text-slate-600">{sizeLabel}</span>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className={`rounded-full border px-3 py-1 text-sm ${formData.sizes.includes(s) ? "bg-amber-500 text-black" : "bg-white text-slate-700"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <label className="block text-sm text-slate-600">
          <span className="mb-2 block">SKU</span>
          <input
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            placeholder="Optional SKU"
          />
        </label>

        <label className="block text-sm text-slate-600">
          <span className="mb-2 block">Tags (comma separated)</span>
          <input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            placeholder="summer, cotton, slim"
          />
        </label>

        <label className="flex items-center gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
          <span>Mark as featured</span>
        </label>

        <label className="flex items-center gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            name="freeShipping"
            checked={formData.freeShipping}
            onChange={handleChange}
          />
          <span>Free shipping</span>
        </label>

        <label className="block text-sm text-slate-600">
          <span className="mb-2 block">Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            placeholder="Short item details..."
          />
        </label>

        <div className="flex items-center gap-4">
          <button type="submit" className="rounded-full bg-slate-900 px-5 py-3 font-semibold text-white">
            Add item
          </button>
          {formData.image ? (
            <img src={formData.image} alt="preview" className="h-12 w-12 rounded-md object-cover" />
          ) : null}
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
