import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useAuth } from "../../auth/auth.context.js";
import { useShops } from "../shop.context.js";
import { useCategories } from "../../categories/category.context.js";
import { Link } from "react-router-dom";
import LoadingSpinnerModal from "../../../components/LoadingSpinnerModal.jsx"


function CreateShop() {
  const user = useAuth()?.user;
  const { createShop } = useShops();
  const { shopCategories = [] } = useCategories();
  const [posterImageFile, setPosterImageFile] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shopDetails, setShopDetails] = useState({
    name: "",
    description: "",
    contact: "",
    category: "", // Leave blank initially
    location: "",
    posterImageFile: null,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleShopCreateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    // if (fileInputRef.current) fileInputRef.current.value = "";

    if (!shopDetails.name || !shopDetails.contact) {
      setError("Name and contact are required.");
      return;
    }

    const finalCategory = shopDetails.category || shopCategories[0]?._id || "";

    const payload = {
      ...shopDetails,
      category: finalCategory,
      posterImageFile,
    };
    try {
      const shopCreationData = await createShop(payload);

      if (shopCreationData.success) {
        setMessage(`Shop "${shopDetails.name}" created successfully!`);
        navigate(`/profile/${user?.id || user?._id}`);
      } else {
        setError(
          shopCreationData.message ||
            "Unable to create shop. Please try again.",
        );
      }
    } catch (err) {
      // 3. THIS CATCHES THE "Shop with this name already exists" THROWN ERROR!
      console.error("Caught form submission error:", err);

      // Read the exact message thrown from your apiClient / backend
      setError(
        err.message || "An unexpected error occurred while creating the shop.",
      );
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPosterImageFile(null);
    }
  };

  const { createShopCategory, creatingCategory } = useCategories();

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const ADD_NEW_VALUE = "__add_new__";

  const handleCategorySelectChange = (e) => {
    if (e.target.value === ADD_NEW_VALUE) {
      setIsAddingCategory(true);
      setCategoryError("");
      return;
    }
    handleChange(e); // normal category selection, unchanged
  };

  const handleCreateCategory = async () => {
    setCategoryError("");
    try {
      const created = await createShopCategory(newCategoryName);
      // select the newly created category on the form automatically
      handleChange({ target: { name: "category", value: created._id } });
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
          onSubmit={handleShopCreateSubmit}
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

            {!isAddingCategory ? (
              <select
                name="category"
                value={shopDetails.category}
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

          {/* Poster Image */}
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block">Poster Image URL</span>
              <input
                type="text"
                name="posterImage"
                value={shopDetails.posterImage}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
                placeholder="https://example.com/image.jpg"
                disabled={!!posterImageFile}
              />
            </label>

            <label className="block text-sm text-slate-300">
              <span className="mb-2 block">Upload Poster Image</span>
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

          {/* Submission and Preview Actions */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-300"
            >
               {loading ? (
                            <LoadingSpinnerModal
                              isOpen={loading}
                              message="creating shop please wait..."
                            />
                          ) : (
                            "Create Shop"
                          )}
            </button>

            {shopDetails.posterImage && (
              <img
                src={shopDetails.posterImage}
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

export default CreateShop;
