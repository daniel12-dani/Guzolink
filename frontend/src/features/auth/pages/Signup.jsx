import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.context.js";
import Modal from "../../../components/Modal.jsx";
import LoadingSpinnerModal from "../../../components/LoadingSpinnerModal.jsx";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    countryCode: "+251",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // After a successful registration the backend returns:
  // { success:true, bearerToken:<jwt>, user:{id,username,email,role} }
  // We store token & user via the auth context (which writes to localStorage).

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signup(
      formData.username,
      formData.email,
      formData.password,
      formData.countryCode + formData.phone,
      formData.address,
    );

    setLoading(false);

    if (result.success) {
      const userId = result.user.id;
      navigate("/profile/" + userId);
      return;
    }

    setError(result.message || "This email is already registered.");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 text-slate-800">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:flex-row lg:items-center">
        <div className="flex-1 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
            Join Guzolink
          </p>
          <h1 className="text-4xl font-bold">Create your account</h1>
          <p className="max-w-xl text-lg text-slate-600">
            Enjoy a smoother checkout, save your favorite items, and receive
            tailored recommendations.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 rounded-3xl bg-slate-900 p-6 text-white shadow-xl"
        >
          <h2 className="mb-6 text-2xl font-semibold">Create account</h2>
          {error ? (
            <Modal
              isOpen={true}
              onClose={() => setError("")}
              title="Signup Error"
              message={error}
            />
          ) : null}

          <label className="mb-4 block">
            <span className="mb-2 block text-sm">Full name</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              placeholder="Your name"
              required
            />
          </label>

          <label className="mb-4 block">
            <span className="mb-2 block text-sm">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="mb-4 block">
            <span className="mb-2 block text-sm">Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
              placeholder="At least 6 characters"
              minLength="6"
              required
            />
          </label>

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
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none"
                placeholder="912345678"
              />
            </div>
          </label>

          <label className="mb-6 block">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-300"
          >
            {loading ? (
              <LoadingSpinnerModal
                isOpen={loading}
                message="Generating report..."
              />
            ) : (
              "Create account"
            )}
          </button>

          <p className="mt-4 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-amber-400">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
