import { useState } from "react";

function ShopRequestPanel() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    size: "",
    price: "",
    color: "",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", category: "", size: "", price: "", color: "", note: "" });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Shop request form</h2>
      <p className="mt-3 text-sm text-slate-600">
        Request a custom item by providing the product details below.
      </p>

      {submitted && (
        <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
          Your request has been submitted. We’ll review it and add it to the shop soon.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm text-slate-700">
            <span className="mb-2 block">Item name</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              required
              placeholder="Trouser, Shirt, Shoes..."
            />
          </label>

          <label className="block text-sm text-slate-700">
            <span className="mb-2 block">Category</span>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              placeholder="Men, Women, Kids..."
            />
          </label>

          <label className="block text-sm text-slate-700">
            <span className="mb-2 block">Size</span>
            <input
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              placeholder="S, M, L, 32, 34"
            />
          </label>

          <label className="block text-sm text-slate-700">
            <span className="mb-2 block">Price</span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              placeholder="49.99"
            />
          </label>

          <label className="block text-sm text-slate-700">
            <span className="mb-2 block">Color</span>
            <input
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              placeholder="Black, Blue"
            />
          </label>
        </div>

        <label className="block text-sm text-slate-700">
          <span className="mb-2 block">Request note</span>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows="3"
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            placeholder="Tell us anything special about the item."
          />
        </label>

        <button className="w-full rounded-full bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800">
          Submit request
        </button>
      </form>
    </div>
  );
}

export default ShopRequestPanel;
