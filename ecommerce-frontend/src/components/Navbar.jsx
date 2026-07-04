import { Link, NavLink } from "react-router-dom";
import { useProducts } from "../context/products";

function Navbar() {
  const { cart, user, logout } = useProducts();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-semibold tracking-tight text-slate-900">
          Guzolink
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <NavLink to="/" className={({ isActive }) => (isActive ? "text-amber-600" : "")}>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? "text-amber-600" : "")}>
            Products
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? "text-amber-600" : "")}>
            Cart ({cart.length})
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 sm:inline">
                Hi, {user.name}
              </span>
              <button onClick={logout} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700">
                Login
              </Link>
              <Link to="/signup" className="rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
