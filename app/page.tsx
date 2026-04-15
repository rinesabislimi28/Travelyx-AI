/**
 * Landing Page Component
 * 
 * The main entry point of the Travelyx-AI application. Displays the hero section,
 * application features, working mechanism, and handles non-authenticated user navigation
 * to the login and signup flows.
 */
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
      <div className="floating-orb one animate-float-slow" />
      <div className="floating-orb two animate-float-fast delay-300" />

      <div className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#07101d]/80 py-4 backdrop-blur-xl transition-all">
        <nav className="shell flex items-center justify-between">
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
          <Link href="/signup" className="button-primary text-sm shadow-[0_0_20px_rgba(53,198,179,0.3)]">
            Create account
          </Link>
        </div>
      </nav>
      </div>

      <main className="shell pt-8 md:pt-12">
        <section className="hero-grid items-start">
          <div className="col-span-12 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-6 sm:p-8 lg:col-span-7 lg:p-10 animate-fade-in-up">
            <div>
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
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="panel-soft rounded-[1.5rem] p-5 text-left border border-white/10 relative overflow-hidden group transition-all hover:border-[#ff7a59]/30">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff7a59]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <svg className="w-6 h-6 text-[#ff7a59] mb-3 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400 relative z-10">Search</p>
                <p className="mt-1 text-xl font-bold text-white relative z-10">Flex Input</p>
              </div>
              <div className="panel-soft rounded-[1.5rem] p-5 text-left border border-white/10 relative overflow-hidden group transition-all hover:border-[#35c6b3]/30">
                <div className="absolute inset-0 bg-gradient-to-br from-[#35c6b3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <svg className="w-6 h-6 text-[#35c6b3] mb-3 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400 relative z-10">Duration</p>
                <p className="mt-1 text-xl font-bold text-white relative z-10">1 to 14 days</p>
              </div>
              <div className="panel-soft rounded-[1.5rem] p-5 text-left border border-white/10 relative overflow-hidden group transition-all hover:border-[#ffd166]/30">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffd166]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <svg className="w-6 h-6 text-[#ffd166] mb-3 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400 relative z-10">Mobile</p>
                <p className="mt-1 text-xl font-bold text-white relative z-10">Responsive</p>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-white/10 relative h-48 w-full group transition-all">
              <img 
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
                alt="Travel experience" 
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#26d0b8]">Smart savings</p>
                  <p className="mt-1 text-lg font-bold text-white">Experience more.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 flex flex-col gap-4 lg:col-span-5 animate-fade-in-up delay-100">
            <div className="relative h-64 w-full overflow-hidden rounded-[2rem] border border-white/10 lg:h-auto lg:min-h-[300px] animate-float-slow group">
              <img 
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop" 
                alt="Beautiful travel destination" 
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff855f]">Endless exploration</p>
                <p className="mt-1 text-lg font-bold text-white">Lago di Braies, Italy</p>
              </div>
            </div>

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

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] animate-fade-in-up delay-200">
          <div className="panel rounded-[2rem] p-6 sm:p-8 hover:shadow-[0_0_30px_rgba(255,133,95,0.15)] transition-all duration-500">
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

          <div className="panel-soft rounded-[2rem] p-6 sm:p-8 hover:shadow-[0_0_30px_rgba(53,198,179,0.15)] transition-all duration-500">
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
        <div className="rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-white/6 to-white/3 px-5 py-8 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div className="pr-4 border-b border-white/10 pb-6 lg:border-b-0 lg:border-r lg:pb-0">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#35c6b3] text-sm font-black text-slate-900 shadow-md">
                  T
                </div>
                <p className="display-font text-2xl font-bold text-white">Travelyx</p>
              </Link>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
                AI travel planning for modern city breaks and destination journeys. Fully dynamic structure, safe profile management, and mobile-ready UI. Let AI map out your perfect trip while you focus on the packing.
              </p>
              <div className="mt-6 flex gap-4">
                <Link href="/signup" className="text-sm font-bold text-[#ff855f] hover:text-[#ff9c7a] hover:underline underline-offset-4">Get Started Today →</Link>
              </div>
            </div>
            
            <div className="lg:pl-4">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#35c6b3]">Platform</p>
              <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-slate-300">
                <Link href="/login" className="hover:text-white transition-colors">Access your Dashboard</Link>
                <Link href="/signup" className="hover:text-white transition-colors">Create a free account</Link>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">How the AI planner works</Link>
                <span className="text-slate-500">More features coming soon...</span>
              </div>
            </div>
            
            <div className="lg:pl-4">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Legal & Support</p>
              <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-slate-300">
                {footerLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                ))}
                <span className="mt-2 block text-xs leading-5 text-slate-500">
                  By using this app, you agree to our policies. Powered by Llama 3 via Groq SDK.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Travelyx AI Studio. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              <p>System operational</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
