import { useState } from "react";
import { useAuth } from "../features/auth/auth.context.js";

const CHANNELS = [
  {
    label: "Email",
    value: "support@guzolink.com",
    href: "mailto:support@guzolink.com",
  },
  {
    label: "Phone",
    value: "+251 910184187",
    href: "tel:+251910184187",
  },
  {
    label: "Office",
    value: "AASTU, Addis Ababa, Ethiopia",
    href: "https://maps.google.com/?q=AASTU+Addis+Ababa",
  },
];

function ContactUs() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.username || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in your name, email, and message.");
      return;
    }

    // NOTE: there's no /api/contact endpoint on the backend yet.
    // Once one exists, replace this with a real `request("/api/contact", ...)`
    // call from shared/lib/apiClient.js, following the same pattern as
    // Login/Signup. For now this just confirms the message locally.
    setSubmitted(true);
  };

  return (
    <div className="px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            Contact us
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            Questions, feedback, or a shop you'd like to see here?
          </h1>
          <p className="text-lg text-slate-300">
            Whether you're a shopper with an order question or a merchant
            looking to get started, our team usually replies within one
            business day.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Contact channels */}
          <div className="space-y-4">
            {CHANNELS.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.label === "Office" ? "_blank" : undefined}
                rel={
                  channel.label === "Office"
                    ? "noreferrer noopener"
                    : undefined
                }
                className="block rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-amber-500/40 hover:bg-white/10"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
                  {channel.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {channel.value}
                </p>
              </a>
            ))}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
                Support hours
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Monday – Saturday, 9:00 AM – 7:00 PM (EAT)
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl bg-slate-900 p-6 shadow-xl sm:p-8">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
                <p className="text-2xl font-semibold text-white">
                  Message sent
                </p>
                <p className="max-w-sm text-sm text-slate-300">
                  Thanks for reaching out — we'll get back to you at{" "}
                  {formData.email} soon.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="mb-6 text-2xl font-semibold text-white">
                  Send us a message
                </h2>

                {error ? (
                  <p className="mb-4 rounded-xl bg-red-500/20 p-3 text-sm text-red-200">
                    {error}
                  </p>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm">Name</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none ring-0"
                      placeholder="Your name"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm">Email</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none ring-0"
                      placeholder="you@example.com"
                      required
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm">Subject</span>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none ring-0"
                    placeholder="What's this about?"
                  />
                </label>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm">Message</span>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none ring-0"
                    placeholder="Tell us how we can help"
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="mt-6 w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
