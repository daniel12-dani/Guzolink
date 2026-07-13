const STEPS = [
  {
    title: "Browse local shops",
    body: "Explore products from verified merchants across Addis Ababa and beyond, all in one place.",
  },
  {
    title: "Order with confidence",
    body: "Every shop is run by a real merchant on the platform — see exactly who you're buying from.",
  },
  {
    title: "Get it delivered",
    body: "The merchant ships directly to you. Track your order from checkout to your doorstep.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
        How it works
      </p>
      <h2 className="mt-2 text-3xl font-bold text-white">
        Local shops, one marketplace
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <div
            key={step.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <span className="text-sm font-semibold text-amber-400">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-lg font-semibold text-white">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-slate-300">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}