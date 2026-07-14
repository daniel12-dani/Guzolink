import { Link } from "react-router-dom";
import { useAuth } from "../../auth/auth.context.js";

function ShopFormUi({
  message,
  error,
  handleSubmit,
  shopDetails,
  handleChange,
  shopCategories = [],
  fileInputRef,
}) {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 text-slate-800">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:flex-row lg:items-center">
        <div className="flex-1 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
            Add new Guzolink shop
          </p>
          <h1 className="text-4xl font-bold">Create new shop</h1>
          <p className="max-w-xl text-lg text-slate-600">
            Enter information about your shop to reach millions of customers.
          </p>
        </div>

        {message && (
          <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
            {message}
          </p>
        )}
        {/* Error Banner */}
        {error && (
          <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 border border-rose-200">
            {error}
          </p>
        )}
        <Link
          to={"/profile/" + user.id}
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition mb-2 mt-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to dashboard
        </Link>
        <form
          onSubmit={handleSubmit}
          className="flex-1 rounded-3xl bg-slate-900 p-6 text-white shadow-xl space-y-4"
        >
          {/* Shop Name */}
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Shop name</span>
            <input
              name="name"
              value={shopDetails.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              required
            />
          </label>

          {/* Description */}
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Description</span>
            <textarea
              name="description"
              value={shopDetails.description}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              placeholder="Brief description..."
            />
          </label>

          {/* Contact Details */}
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Contact (email or phone)</span>
            <input
              name="contact"
              value={shopDetails.contact}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              required
            />
          </label>

          {/* Category Dropdown */}
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Category</span>
            <select
              name="category"
              value={shopDetails.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
            >
              {shopCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          {/* Location */}
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Location</span>
            <input
              name="location"
              value={shopDetails.location}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              placeholder="City, Country"
            />
          </label>

          {/* Poster Image (Changed to type="text" to accept the URL cleanly) */}
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block">Poster Image URL</span>
              <input
                type="text"
                name="posterimage"
                value={shopDetails.posterimage}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </label>

            {/* upload your own poster */}
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block">Upload Poster Image</span>
              <input
                type="file"
                name="posterimage"
                ref={fileInputRef}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              />
            </label>
          </div>

          {/* Submission and Preview Actions */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={!shopDetails.name || !shopDetails.contact}
              className="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-300"
            >
              Create Shop
            </button>

            {shopDetails.posterimage && (
              <img
                src={shopDetails.posterimage}
                alt="preview"
                className="h-12 w-12 rounded-md object-cover shrink-0"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShopFormUi;
