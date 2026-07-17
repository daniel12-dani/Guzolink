import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/auth.context.js";
import { useCart } from "../features/cart/cart.context.js";


function CartImage({ src, alt }) {
  if (!src) {
    return (
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-900/60 text-slate-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-20 w-20 shrink-0 rounded-xl object-cover"
      onError={(e) => {
        e.currentTarget.style.display = "none";
        e.currentTarget.nextSibling.style.display = "flex";
      }}
    />
  );
}

function CartLine({ item, onIncrease, onDecrease, onRemove }) {
  const lineTotal = (item.price * item.quantity).toFixed(2);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center">
      <div className="relative">
        <CartImage src={item.image} alt={item.name} />
        <div
          style={{ display: "none" }}
          className="absolute inset-0 hidden items-center justify-center rounded-xl bg-slate-900/60 text-slate-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
            />
          </svg>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-semibold text-white">
          {item.name}
        </h3>
        <p className="text-sm text-slate-400">
          {item.category?.name || item.category}
          {item.category ? " · " : ""}
          <span className="text-amber-400">${item.price}</span> each
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-white/10 bg-slate-900">
          <button
            type="button"
            onClick={onDecrease}
            aria-label={`Decrease quantity of ${item.name}`}
            className="h-9 w-9 rounded-full text-lg font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-semibold text-white">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={onIncrease}
            aria-label={`Increase quantity of ${item.name}`}
            className="h-9 w-9 rounded-full text-lg font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            +
          </button>
        </div>

        <p className="w-16 shrink-0 text-right font-semibold text-white">
          ${lineTotal}
        </p>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.name} from cart`}
          className="rounded-full p-2 text-slate-400 transition hover:bg-red-500/20 hover:text-red-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Cart() {
  const { cart, total, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const { user } = useAuth();

  if (cart.length === 0) {
    return (
      <div className="px-4 py-24 text-center text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            Your cart
          </p>
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="text-slate-300">
            Browse the marketplace and add something you like — it'll show
            up here.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-amber-400"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
              Your cart
            </p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
              {cart.length} item{cart.length === 1 ? "" : "s"}
            </h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-medium text-slate-400 transition hover:text-red-300"
          >
            Clear cart
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Line items */}
          <div className="space-y-4">
            {cart.map((item) => (
              <CartLine
                key={item.id}
                item={item}
                onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                onRemove={() => removeFromCart(item.id)}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="h-fit space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Order summary</h2>

            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between border-t border-white/10 pt-4 text-base font-semibold text-white">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {user ? (
              <Link
                to="/checkout"
                className="block w-full rounded-full bg-amber-500 px-4 py-3 text-center font-semibold text-slate-900 transition hover:bg-amber-400"
              >
                Proceed to checkout
              </Link>
            ) : (
              <Link
                to="/login"
                className="block w-full rounded-full bg-amber-500 px-4 py-3 text-center font-semibold text-slate-900 transition hover:bg-amber-400"
              >
                Login to checkout
              </Link>
            )}
            <Link
              to="/"
              className="block w-full rounded-full border border-white/20 px-4 py-3 text-center font-semibold text-white transition hover:bg-white/10"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
