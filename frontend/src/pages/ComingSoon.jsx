// ComingSoonPage.jsx

import { ArrowLeft, Rocket, Sparkles } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">
      {/* Background */}

      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-[150px]" />
        <div className="absolute left-20 top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-[120px]" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-blue-500/20 blur-[150px]" />
      </div>

      {/* Grid */}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Card */}

      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
        {/* Badge */}

        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
          <Sparkles size={16} />
          Feature in Development
        </div>

        {/* Icon */}

        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-cyan-500/15 text-cyan-400">
          <Rocket size={48} />
        </div>

        {/* Title */}

        <h1 className="text-5xl font-black tracking-tight text-white">
          Coming Soon
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          We're building something amazing behind the scenes. This feature is
          currently under development and will be available in a future update.
        </p>

        {/* Launch Card */}

        <div className="mt-10 rounded-2xl border border-white/10 bg-black/20 p-6">
          <h2 className="text-lg font-semibold text-white">
            🚀 What's Coming?
          </h2>

          <ul className="mt-4 space-y-3 text-slate-300">
            <li>• Product details </li>

            <li>• Batch ordering </li>

            <li>• Advanced search </li>

            <li>• Better user experience</li>
          </ul>
        </div>

        {/* Notify */}

        <div className="mt-10">
          <p className="mb-4 text-sm text-slate-400">
            Get notified when it launches
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
            />

            <button className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
              Notify Me
            </button>
          </div>
        </div>

        {/* Footer */}

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <p className="text-sm text-slate-500">© 2026 guzo link</p>
        </div>
      </div>
    </div>
  );
}
