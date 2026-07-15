import { Link, NavLink } from "react-router-dom";
import { useCart } from "../features/cart/cart.context.js";
import { useAuth } from "../features/auth/auth.context.js";

function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink 
          to="/"
          className="text-xl font-semibold tracking-tight text-white"
        >
          Guzolink
        </NavLink>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "text-amber-600" : "")}
          >
            Home
          </NavLink>

          <NavLink
            to={`/profile/${user?.id || user?._id}`}
            className={({ isActive }) => (isActive ? "text-amber-600" : "")}
          >
            Dashboard
          </NavLink>

          {/* <NavLink to="/shops" className={({ isActive }) => (isActive ? "text-amber-600" : "")}>
            Dashboard
          </NavLink> */}

          <NavLink
            to="/cart"
            className={({ isActive }) => (isActive ? "text-amber-600" : "")}
          >
            Cart ({cart.length})
          </NavLink>
          <NavLink
            to="/aboutus"
            className={({ isActive }) => (isActive ? "text-amber-600" : "")}
          >
            About us
          </NavLink>
          <NavLink
            to="/support"
            className={({ isActive }) => (isActive ? "text-amber-600" : "")}
          >
            Contact us
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* IDEA: do i need context provider to show current user profile ? or can i use the dashboard to show the button then clickable button to update user ?
            Solution:   to use the span and move the profile to dashboard
            */}

              <span className="hidden rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200 sm:inline">
                Hi, {user.username}
              </span>

              <button
                onClick={logout}
                className="rounded-full border border-white/20 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-white/20 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-amber-500 px-3 py-1.5 text-sm font-medium text-slate-950 hover:bg-amber-400"
              >
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
