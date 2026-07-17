import { useAuth } from "../features/auth/auth.context.js";
import { Link } from "react-router-dom";
import GuzoMark from "./GuzoMark.jsx"; // adjust path to match where it actually lives

function Hero() {
  const { user } = useAuth();
  return (
    <section className="relative overflow-hidden px-4 py-20 text-white sm:px-6 lg:px-8">
      {/* Background watermark — plain footprint, slate-toned to sit quietly
          behind the content instead of competing with the amber accents. */}
      <GuzoMark
        plain
        footClassName="fill-slate-700/20"
        className="pointer-events-none absolute -right-24 -top-24 hidden w-[32rem] rotate-12 sm:block lg:w-[40rem]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <GuzoMark
            size={70}
            circleClassName="fill-amber-500"
            footClassName="fill-slate-950"
          />

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            New season essentials
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            Shop smarter with curated favorites for everyday life.
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Discover premium gadgets, accessories, and lifestyle picks designed
            to simplify your routine.
          </p>
          <div className="flex flex-wrap gap-3">
        
            <Link
              to="#products"
              className="rounded-full bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              Shop now
            </Link>
            {user ? (
              <Link
                to={`/profile/${user.id || user._id}`}
                className="rounded-full border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                My Dashboard
              </Link>
            ) : (
              <Link
                to="/signup"
                className="rounded-full border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Create account
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">Free shipping</p>
              <p className="mt-2 text-2xl font-semibold">On orders over $100</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">Secure checkout</p>
              <p className="mt-2 text-2xl font-semibold">Fast and reliable</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 sm:col-span-2">
              <p className="text-sm text-slate-300">Top rated support</p>
              <p className="mt-2 text-2xl font-semibold">24/7 customer care</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;