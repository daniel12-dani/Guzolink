import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.context";


function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
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

    const result = await signup(formData.username, formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      navigate("/products");
      return;
    }

    setError(result.message || "This email is already registered.");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 text-slate-800">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:flex-row lg:items-center">
        <div className="flex-1 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">Join Guzolink</p>
          <h1 className="text-4xl font-bold">Create your account</h1>
          <p className="max-w-xl text-lg text-slate-600">
            Enjoy a smoother checkout, save your favorite items, and receive tailored recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
          <h2 className="mb-6 text-2xl font-semibold">Create account</h2>
          {error ? <p className="mb-4 rounded-xl bg-red-500/20 p-3 text-sm text-red-200">{error}</p> : null}

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

          <label className="mb-6 block">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-300"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="mt-4 text-center text-sm text-slate-400">
            Already have an account? <Link to="/login" className="font-semibold text-amber-400">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
