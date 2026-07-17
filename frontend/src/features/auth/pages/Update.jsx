import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth.context";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function UpdateUserInfo() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    countryCode: "+251",
    phone: "",
    address: "",
    profileImage: "", // Unified key
  });
  const [formError, setFormError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Set initial state values once the user loads
  useEffect(() => {
    if (!user) return;

    // Attempt to split user phone number if they already have one configured
    let rawPhone = String(user.phone ?? "");
    let extractedPhone = rawPhone;
    let extractedCode = "+251";

    if (rawPhone.startsWith("+")) {
      // Basic extraction of 3-digit country codes or +251
      if (rawPhone.startsWith("+251")) {
        extractedCode = "+251";
        extractedPhone = rawPhone.replace("+251", "");
      } else {
        // Fallback or handling other codes if needed
        extractedCode = rawPhone.slice(0, 4);
        extractedPhone = rawPhone.slice(4);
      }
    }
    // eslint-disable-next-line
    setFormData({
      username: user.username || "",
      countryCode: extractedCode,
      phone: extractedPhone,
      address: user.address || "",
      profileImage: user.profileImage || "",
    });
    setImageFile(null);
    setFormError("");
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setIsUpdating(true);
    try {
      const fullPhoneNumber = formData.phone
        ? `${formData.countryCode}${formData.phone}`
        : "";
      const result = await updateUser(
        formData.username,
        fullPhoneNumber,
        formData.address,
        imageFile,
      );
      if (result.success) {
        logout();
        navigate(`/profile/${result.user.id}`);
        return;
      }
      setFormError(result.message || "Unable to update your account.");
    } catch (err) {
      setFormError(err.message || "An unexpected error occurred while saving.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Safely fallback user ID for routing[cite: 1]
  const userId = user?.id || user?._id || "";

  return (
    <div className="min-h-screen bg-slate-500 px-4 py-16 text-slate-800">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:flex-row lg:items-center">
        <div className="flex-1 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
            Update your account information below:
          </p>
          {userId && (
            <Link
              to={`/profile/${userId}`}
              className="inline-flex items-center gap-1 text-lg text-slate-800 hover:text-red-600 transition mb-2 mt-4"
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
              Back to profile
            </Link>
          )}
        </div>

        {/* user info form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 rounded-3xl bg-slate-900 p-6 text-white shadow-xl"
        >
          <h2 className="mb-6 text-2xl font-semibold">Update account</h2>
          {formError && (
            <p className="mb-4 rounded-xl bg-red-500/20 p-3 text-sm text-red-200">
              {formError}
            </p>
          )}

          {/* User name field */}
          <label className="mb-4 block">
            <span className="mb-2 block text-sm">User name</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              placeholder="Your name"
            />
          </label>

          {/* Phone number field */}
          <label className="mb-4 block">
            <span className="mb-2 block text-sm">Phone number</span>
            <div className="flex gap-2">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm text-white outline-none"
              >
                <option value="+251">🇪🇹 +251</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+254">🇰🇪 +254</option>
                <option value="+255">🇹🇿 +255</option>
                <option value="+256">🇺🇬 +256</option>
                <option value="+27">🇿🇦 +27</option>
                <option value="+234">🇳🇬 +234</option>
                <option value="+20">🇪🇬 +20</option>
              </select>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
                placeholder="912345678"
              />
            </div>
          </label>

          {/* Address field */}
          <label className="mb-4 block">
            <span className="mb-2 block text-sm">Address</span>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              placeholder="City, Country"
            />
          </label>

          {/* Profile image container */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block">Profile Image URL</span>
              <input
                type="text"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
                placeholder="https://example.com/image.jpg"
                disabled={!!imageFile}
              />
            </label>
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block">Upload New Profile Image</span>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              />
            </label>
          </div>

          {/* Submit button container */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating || isUploadingImage}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploadingImage
                ? "Uploading..."
                : isUpdating
                  ? "Saving..."
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateUserInfo;
