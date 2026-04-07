import Link from "next/link";

const features = [
  {
    title: "Plan with city-level prompts",
    text: "Search with a city, a country, or both. The app is no longer limited to a rigid destination dropdown.",
  },
  {
    title: "Save trips that stay usable",
    text: "Generated plans remain readable, editable, and easy to revisit from desktop or mobile.",
  },
  {
    title: "Security flows that feel clear",
    text: "Profile actions, password changes, and account deletion now surface clearer confirmations and notices.",
  },
];

const steps = [
  "Tell Travelyx where you want to leave from and where you want to go.",
  "Pick the trip style, duration, and budget that fits your plan.",
  "Get a complete itinerary with daily structure, costs, and a saved trip history.",
];

const footerLinks = [
  { href: "/login", label: "Log in" },
  { href: "/signup", label: "Create account" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen pb-16">
      <div className="floating-orb one" />
      <div className="floating-orb two" />

      <nav className="shell flex items-center justify-between pt-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-black text-white shadow-lg shadow-black/20">
            T
          </div>
          <div>
            <p className="display-font text-2xl font-bold tracking-tight text-white">Travelyx</p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Travel AI Studio</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/login" className="button-secondary text-sm">
            Log in
          </Link>
          <Link href="/signup" className="button-primary text-sm">
            Create account
          </Link>
        </div>
      </nav>

      <main className="shell pt-10 md:pt-16">
        <section className="hero-grid items-stretch">
          <div className="col-span-12 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-6 sm:p-8 lg:col-span-7 lg:p-10">
            <span className="eyebrow mb-6">Creative travel planning</span>
            <h1 className="section-title text-balance text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl">
              A travel planner that finally feels premium.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Travelyx helps users plan city breaks and full destination trips with a stronger interface, clearer search, and AI-generated itineraries that still feel practical.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="button-primary">
                Start planning
              </Link>
              <Link href="/login" className="button-secondary">
                Open dashboard
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="panel-soft rounded-[1.5rem] p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Search</p>
                <p className="mt-2 text-xl font-bold text-white sm:text-2xl">City + Country</p>
              </div>
              <div className="panel-soft rounded-[1.5rem] p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Output</p>
                <p className="mt-2 text-xl font-bold text-white sm:text-2xl">1 to 14 days</p>
              </div>
              <div className="panel-soft rounded-[1.5rem] p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Style</p>
                <p className="mt-2 text-xl font-bold text-white sm:text-2xl">Responsive UI</p>
              </div>
            </div>
          </div>

          <div className="col-span-12 flex flex-col gap-4 lg:col-span-5">
            <div className="panel rounded-[2rem] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[#ffd166]">What changed</p>
              <div className="mt-6 space-y-4">
                {features.map((feature) => (
                  <div key={feature.title} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                    <h2 className="text-lg font-bold text-white">{feature.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-soft rounded-[2rem] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[#35c6b3]">Designed for real use</p>
              <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-5">
                <p className="text-2xl font-bold text-white">Modern landing, cleaner auth, stronger dashboard.</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  The new visual system uses layered gradients, sharper cards, better spacing, and a stronger mobile layout across the app.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="panel rounded-[2rem] p-6 sm:p-8">
            <span className="eyebrow mb-4">How it works</span>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-300 sm:text-base">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-soft rounded-[2rem] p-6 sm:p-8">
            <span className="eyebrow mb-4">Why users stay</span>
            <p className="section-title text-3xl font-bold text-white sm:text-4xl">
              Better planning starts with a better feeling interface.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              The app now looks more intentional, reads better on mobile, and supports free-form destination input so users can actually search the way they think.
            </p>
            <Link href="/signup" className="button-primary mt-8">
              Build your next trip
            </Link>
          </div>
        </section>
      </main>

      <footer className="shell mt-14 border-t border-white/10 pt-6">
        <div className="rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-white/6 to-white/3 px-5 py-6 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr_0.8fr]">
            <div>
              <p className="display-font text-xl font-bold text-white">Travelyx</p>
              <p className="mt-2 max-w-md text-sm leading-7 text-slate-400">
                AI travel planning for modern city breaks and destination journeys, designed to feel clean, fast, and practical.
              </p>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Product</p>
              <div className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
                <span>City or country search</span>
                <span>AI itinerary generation</span>
                <span>Saved trip history</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Links</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-300">
                {footerLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Travelyx. All rights reserved.</p>
            <p>Built for responsive travel planning across phone, tablet, and laptop.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
