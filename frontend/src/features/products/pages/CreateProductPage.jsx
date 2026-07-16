import { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCategories } from "../../categories/category.context.js";
import useShopProducts from "../hooks/useShopProducts.js";

export default function CreateProductCard() {
  const { shopId } = useParams();
  const navigate = useNavigate();

  // Consume your REST categories context
  const {
    productCategories = [],
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // Consume your GraphQL mutation hook
  const fileInputRef = useRef(null);
  const { createProduct, isCreating, createError } = useShopProducts(shopId);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // product category related 
  const { createProductCategory, creatingProductCategory } = useCategories();
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

  const handleCreateProductCategory = async () => {
    setCategoryError("");
    try {
      const created = await createProductCategory(newCategoryName);
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
  const [productDetails, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Required fields check
    if (
      !productDetails.name ||
      !productDetails.price ||
      !productDetails.stock ||
      !productDetails.category
    ) {
      setFormError("Please fill out all required fields marked with *.");
      return;
    }

    try {
      await createProduct({
        ...productDetails,
        shop: shopId, // Inject shopId from the URL route parameter
      });

      setSuccessMessage("Product successfully created!");

      // Reset form fields
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: "",
      });

      // Redirect back to the shop dashboard after a brief delay
      setTimeout(() => {
        navigate(`/shops/${shopId}`);
      }, 1500);
    } catch (err) {
      setFormError(
        err.message || "An unexpected error occurred during creation.",
      );
    }
  };

  if (categoriesLoading) {
    return (
      <p className="p-6 text-white text-center">
        Loading category frameworks...
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-xl text-slate-100">
      {/* Back button link matching your design language */}
      <Link
        to={`/shops/${shopId}/products`}
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition mb-6"
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
        Back to Shop Dashboard
      </Link>

      <h2 className="text-2xl font-bold mb-1 text-white">Add New Product</h2>
      <p className="text-sm text-slate-400 mb-6">
        Fill in the fields below to push a new inventory item to this shop.
      </p>

      {/* Conditional Error Panels */}
      {(formError || createError || categoriesError) && (
        <div className="mb-5 p-4 rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-sm">
          {formError || createError || categoriesError}
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-5 p-4 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-sm">
          {successMessage} — Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={productDetails.name}
            onChange={handleChange}
            placeholder="e.g., Wireless Mechanical Keyboard"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 outline-none focus:border-amber-500 transition-colors"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={productDetails.description}
            onChange={handleChange}
            placeholder="Describe product dimensions, specs, and materials..."
            rows="3"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 outline-none focus:border-amber-500 transition-colors resize-none"
          />
        </div>

        {/* Price and Stock Row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Price (birr) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              min="0"
              value={productDetails.price}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 outline-none focus:border-amber-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Available Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              min="0"
              value={productDetails.stock}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 outline-none focus:border-amber-500 transition-colors"
              required
            />
          </div>
        </div>

        {/* Product Category Selection */}
        <div>
          {/* Category Dropdown */}
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Category</span>

            {!isAddingCategory ? (
              <select
                name="category"
                value={productDetails.category}
                onChange={handleCategorySelectChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {productCategories.map((category) => (
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
                  disabled={creatingProductCategory}
                />
                {categoryError && (
                  <p className="text-xs text-rose-400">{categoryError}</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreateProductCategory}
                    disabled={creatingProductCategory || !newCategoryName.trim()}
                    className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {creatingProductCategory ? "Adding..." : "Add category"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelAddCategory}
                    disabled={creatingProductCategory}
                    className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </label>
        </div>

        {/* Image URL Link */}
        {/* Poster Image (Changed to type="text" to accept the URL cleanly) */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Poster Image URL</span>
            <input
              type="text"
              name="posterimage"
              value={productDetails.image}
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

        {/* Button Actions */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isCreating}
            className="w-full md:w-auto px-6 py-3 font-semibold text-sm bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-900 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-slate-900"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Product...
              </>
            ) : (
              "Publish Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
