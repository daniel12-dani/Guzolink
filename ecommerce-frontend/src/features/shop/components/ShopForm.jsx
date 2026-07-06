import { useState, useEffect } from "react";
import { useCategories } from "../../categories/category.context";

function ShopForm({ onAddShop }) {
  const { shopCategories } = useCategories();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contact: "",
    category: "",
    location: "",
    posterimage: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (shopCategories.length > 0 && !formData.category) {
      setFormData((prev) => ({ ...prev, category: shopCategories[0]._id }));
    }
  }, [shopCategories, formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) {
      setMessage("Name and contact are required.");
      return;
    }
    const payload = {
      name: formData.name,
      description: formData.description,
      contact: formData.contact,
      category: formData.category,
      location: formData.location,
      posterimage: formData.posterimage,
    };
    onAddShop(payload);
    setMessage(`Shop "${payload.name}" created.`);
    setFormData({
      name: "",
      description: "",
      contact: "",
      category: shopCategories[0]?._id || "",
      location: "",
      posterimage: "",
    });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Create Shop</h2>
      <p className="mt-2 text-sm text-slate-600">Provide basic shop information.</p>

      {message && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm text-slate-600">
          <span className="mb-2 block">Shop name</span>
          <input name="name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2" required />
        </label>

        <label className="block text-sm text-slate-600">
          <span className="mb-2 block">Description</span>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Brief description..." />
        </label>

        <label className="block text-sm text-slate-600">
          <span className="mb-2 block">Contact (email or phone)</span>
          <input name="contact" value={formData.contact} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2" required />
        </label>

        <label className="block text-sm text-slate-600">
          <span className="mb-2 block">Category</span>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2">
            {shopCategories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm text-slate-600">
          <span className="mb-2 block">Location</span>
          <input name="location" value={formData.location} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="City, Country" />
        </label>

        <label className="block text-sm text-slate-600">
          <span className="mb-2 block">Poster Image URL</span>
          <input name="posterimage" value={formData.posterimage} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="https://example.com/image.jpg" />
        </label>

        <div className="flex items-center gap-4">
          <button type="submit" className="rounded-full bg-slate-900 px-5 py-3 font-semibold text-white">
            Create Shop
          </button>
          {formData.posterimage && (
            <img src={formData.posterimage} alt="preview" className="h-12 w-12 rounded-md object-cover" />
          )}
        </div>
      </form>
    </div>
  );
}

export default ShopForm;
