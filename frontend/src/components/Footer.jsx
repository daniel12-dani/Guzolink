import { NavLink } from "react-router-dom";
import GuzoMark from "./GuzoMark";

function Footer() {
  return (
    <footer className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/50 backdrop-blur">
      <div className="mx-auto space-y-4 max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8 border -b border-white/10">
        <GuzoMark
          size={70}
          circleClassName="fill-amber-500"
          footClassName="fill-slate-950"
        />
        <p>© 2026 Guzolink. All rights reserved.</p>
        <nav className="grid grid-rows-2items-justify gap-6 text-sm font-medium text-slate-300 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "text-amber-600" : "")}
          >
            Home
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => (isActive ? "text-amber-600" : "")}
          >
            Cart
          </NavLink>
          <NavLink
            to="/aboutus"
            className={({ isActive }) => (isActive ? "text-amber-600" : "")}
          >
            About us
          </NavLink>
          <NavLink
            to="/marketplace"
            className={({ isActive }) => (isActive ? "text-amber-600" : "")}
          >
            Marketplace
          </NavLink>
          <NavLink
            to="/support"
            className={({ isActive }) => (isActive ? "text-amber-600" : "")}
          >
            Contact us
          </NavLink>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
