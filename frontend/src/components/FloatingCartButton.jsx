// components/FloatingCartButton.jsx
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../features/cart/cart.context.js";

export default function FloatingCartButton() {
  const { cart } = useCart();
  const location = useLocation();

  // Don't show it while already on the cart page — redundant there
  if (location.pathname === "/cart") return null;
  if (cart.length === 0) return null;

  return (
    <Link
      to="/cart"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/30 transition hover:scale-105 hover:bg-amber-400 sm:bottom-8 sm:right-8"
      aria-label={`View cart, ${cart.length} item${cart.length === 1 ? "" : "s"}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.907-4.723 2.32-7.235.083-.5-.294-.955-.801-.955H5.25M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>
      <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
        {cart.length}
      </span>
    </Link>
  );
}
