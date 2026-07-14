import { Link } from "react-router-dom";

function UpdateUserCard({
  formData,
  loading,
  handleSubmit,
  handleChange,
  error,
}) {
  return (
    <div className="min-h-screen bg-slate-500 px-4 py-16 text-slate-800">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:flex-row lg:items-center">
        <div className="flex-1 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
            Update your account information below:
          </p>
          <Link
            to={`/profile/${formData.id}`}
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
        </div>

        {/* user info form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 rounded-3xl bg-slate-900 p-6 text-white shadow-xl"
        >
          <h2 className="mb-6 text-2xl font-semibold">Update account</h2>
          {error && (
            <p className="mb-4 rounded-xl bg-red-500/20 p-3 text-sm text-red-200">
              {error}
            </p>
          )}

          {/* Full name field */}
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
          {/* Email field */}
          {/* <label className="mb-4 block">
                    <span className="mb-2 block text-sm">Email</span>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
                        placeholder="Your email"
                    />
                </label> */}
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
          {/* profile image */}
          <label className="mb-4 block">
            <span className="mb-2 block text-sm">Profile Image</span>
            <input
              type="file"
              name="profileImage"
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              placeholder="Upload profile image"
            />
          </label>

          {/* submit button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            {loading ? "Updating..." : "Update Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateUserCard;
