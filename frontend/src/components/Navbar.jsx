import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../features/cart/cart.context.js";
import { useAuth } from "../features/auth/auth.context.js";
import ConfirmModal from "./ConfirmModal.jsx"; // adjust path to match where it actually lives

function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const linkClass = ({ isActive }) =>
    `block py-2 ${isActive ? "text-amber-500" : "text-slate-300"}`;

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutConfirm(false);
    } finally {
      setIsLoggingOut(false);
    }
  };
  // navlink on click set the shutter hidden
  useEffect(() => {
    const handleNavLinkClick = () => {
      setIsMenuOpen(false);
    };

    // Add event listener to all NavLink elements
    const navLinks = document.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", handleNavLinkClick);
    });

    // Cleanup event listeners on unmount
    return () => {
      navLinks.forEach((link) => {
        link.removeEventListener("click", handleNavLinkClick);
      });
    };
  }, []);
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/50 backdrop-blur">
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
          <div className="hidden items-center gap-3 sm:flex">
            {user ? (
              <>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">
                  Hi, {user.username}
                </span>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
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

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="rounded-lg p-2 text-slate-200 hover:bg-white/10 md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Shutter panel — grid-rows trick animates height without
          needing to know the content's pixel height in advance
          (a plain max-height transition would need a guessed cap). */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-white/10 px-4 py-4 sm:px-6">
          <nav className="flex flex-col text-sm font-medium">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink
              to={`/profile/${user?.id || user?._id}`}
              className={linkClass}
            >
              Dashboard
            </NavLink>
            <NavLink to="/cart" className={linkClass}>
              Cart ({cart.length})
            </NavLink>
            <NavLink to="/aboutus" className={linkClass}>
              About us
            </NavLink>
            <NavLink to="/support" className={linkClass}>
              Contact us
            </NavLink>
          </nav>

          <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
            {user ? (
              <>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">
                  Hi, {user.username}
                </span>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="rounded-full border border-white/20 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-full border border-white/20 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-full bg-amber-500 px-3 py-1.5 text-sm font-medium text-slate-950 hover:bg-amber-400"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal
        open={showLogoutConfirm}
        title="Log out?"
        message="You'll need to log back in to access your dashboard and shops."
        confirmLabel="Log out"
        isDangerous={false}
        isConfirming={isLoggingOut}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
}

export default Navbar;
