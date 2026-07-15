const VALUES = [
  {
    title: "Merchants first",
    body: "No listing fees to get started, transparent payouts, and tools built around how small shops actually operate.",
  },
  {
    title: "Real people, real shops",
    body: "Every storefront is run by a verified merchant — you always know who you're buying from.",
  },
  {
    title: "Built for Addis Ababa",
    body: "Local delivery, local currency, local support. We're solving for our own city first.",
  },
];

const STATS = [
  { label: "Active shops", value: "120+" },
  { label: "Products listed", value: "3,400+" },
  { label: "Cities served", value: "6" },
];

function AboutUs() {
  return (
    <div>
      <section className="px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            About Guzolink
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            One marketplace for every local shop worth knowing.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Guzolink started as a simple question: why should opening a shop
            online mean disappearing into a sea of anonymous listings? We
            built a marketplace where merchants keep their identity and
            shoppers know exactly who they're supporting.
          </p>
        </div>
      </section>

      <div className="space-y-16 pb-16">
        {/* Stats */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center"
              >
                <p className="text-3xl font-bold text-amber-400">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
                Our story
              </p>
              <h2 className="text-3xl font-bold text-white">
                From one merchant's storefront to a citywide marketplace
              </h2>
            </div>
            <div className="space-y-4 text-slate-300">
              <p>
                Guzolink began with merchants who were tired of choosing
                between a generic storefront and building their own site from
                scratch. We wanted something in between: a shared platform
                that still felt like their own shop.
              </p>
              <p>
                Today, merchants across Addis Ababa list products, manage
                orders, and reach customers who are shopping locally on
                purpose — not settling for whatever shows up in a global
                search. As more shops join, the whole marketplace gets more
                useful for everyone browsing it.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
            What we care about
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            The principles behind the platform
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-lg font-semibold text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300">{value.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 to-transparent p-10 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
                Join us
              </p>
              <h2 className="mt-2 max-w-md text-3xl font-bold text-white">
                Whether you're shopping or selling, there's a place for you
                here
              </h2>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <a
                href="/signup"
                className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-amber-400"
              >
                Create an account
              </a>
              <a
                href="/support"
                className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Contact us
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;
