import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.context.js";
import Modal from "../../../components/Modal.jsx";


function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // After a successful login the backend returns:
  // { success:true, bearerToken:<jwt>, user:{id,username,email,role} }
  // The auth context stores the token & user, keeping the session alive.

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      navigate("/profile/" + result.user.id);
      return;
    }
    console.log("Login error:", result.message);
    setError(result.message || "Invalid email or password.");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 text-slate-800">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:flex-row lg:items-center">
        <div className="flex-1 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
            Welcome back
          </p>
          <h1 className="text-4xl font-bold">Sign in to continue shopping</h1>
          <p className="max-w-xl text-lg text-slate-600">
            Access your order history, save products for later, and breeze
            through checkout.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 rounded-3xl bg-slate-900 p-6 text-white shadow-xl"
        >
          <h2 className="mb-6 text-2xl font-semibold">Login</h2>
          {/* TODO: implement small notification model card that displays over the window */}
         
          {error ? (
            <Modal isOpen={true} onClose={() => setError("")} title="Login Error" message={error} />
          ) : null}

          <label className="mb-4 block">
            <span className="mb-2 block text-sm">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none ring-0"
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
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none ring-0"
              placeholder="Enter password"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-300"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="mt-4 text-center text-sm text-slate-400">
            New here ?{" "}
            <Link to="/signup" className="font-semibold text-amber-400">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
