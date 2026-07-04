import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/products";

function Checkout() {
  const { cart, clearCart, total } = useProducts();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    card: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16 text-slate-800">
        <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Order placed</p>
          <h1 className="mt-3 text-3xl font-bold">Thank you for your purchase!</h1>
          <p className="mt-4 text-slate-600">
            Your order is confirmed and will arrive soon. A receipt has been sent to your email.
          </p>
          <Link to="/products" className="mt-8 inline-flex rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 text-slate-800">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="mt-2 text-slate-600">Secure checkout with a demo payment form.</p>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm">Full name</span>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm">Address</span>
              <input name="address" value={formData.address} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm">City</span>
              <input name="city" value={formData.city} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm">Card number</span>
              <input name="card" value={formData.card} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
            </label>
          </div>

          <button className="mt-8 w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400">
            Place order
          </button>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-sm">
          <h2 className="text-2xl font-semibold">Order Summary</h2>
          <div className="mt-6 space-y-3">
            {cart.length === 0 ? (
              <p className="text-slate-400">Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-slate-700 pt-4 text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
