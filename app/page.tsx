/**
 * Landing Page Component
 * 
 * The main entry point of the Travelyx-AI application. Displays the hero section,
 * application features, working mechanism, and handles non-authenticated user navigation
 * to the login and signup flows.
 */
/**
 * Travelyx-AI Landing Page
 * 
 * The main public-facing entry point of the application. Showcases features,
 * provides navigation to authentication flows, and demonstrates the platform's
 * value proposition to potential users.
 */
import Link from "next/link";
import { ThemeToggle } from "./components/ThemeToggle";
import Logo from "./components/Logo";

const features = [
  {
    title: "1. Choose your destination",
    text: "Enter any city or country. Define your travel style, from budget backpacking to luxury getaways.",
  },
  {
    title: "2. Let AI build your itinerary",
    text: "Our AI generates a complete, day-by-day schedule with top attractions, activities, and time management.",
  },
  {
    title: "3. Travel stress-free",
    text: "Save your trips to your profile and access your complete travel guide instantly from your phone while on the go.",
  },
];

const steps = [
  "Tell Travelyx where you want to leave from and where you want to go.",
  "Pick the trip style, duration, and budget that fits your plan.",
  "Get a complete itinerary with daily structure, costs, and a saved trip history.",
];

const footerLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="floating-orb one animate-float-slow" />
      <div className="floating-orb two animate-float-fast delay-300" />

      <div className="sticky top-0 z-50 w-full border-b border-[var(--line-strong)] bg-[var(--background)]/80 py-4 backdrop-blur-xl transition-all shadow-sm">
        <nav className="shell flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center overflow-hidden hover:-translate-y-1 transition-transform rounded-xl sm:rounded-2xl shadow-lg shadow-black/20 bg-[#09090b] border border-[#27272a] shrink-0">
              <Logo className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="display-font text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] leading-none mb-1">Travelyx</p>
              <p className="hidden sm:block text-[10px] sm:text-xs font-bold uppercase tracking-[0.28em] text-[var(--muted)] leading-none">Travel AI Studio</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:flex items-center justify-center text-sm font-bold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors px-2">
              Log in
            </Link>
            <Link href="/login" className="button-primary text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 shadow-[0_0_20px_rgba(53,198,179,0.3)]">
              Get Started
            </Link>
          </div>
        </nav>
      </div>

      <main className="shell pt-8 md:pt-12 flex-1">
        <section className="hero-grid items-stretch">
          <div className="panel col-span-12 rounded-[2rem] p-6 sm:p-8 lg:col-span-7 lg:p-10 animate-fade-in-up flex flex-col">
            <div>
              <span className="eyebrow mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35c6b3] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#35c6b3]"></span>
                </span>
                Intelligent travel assistant
              </span>
              <h1 className="section-title text-balance text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl animate-text-gradient">
                Your personal AI travel agent.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                Stop spending hours researching. Tell Travelyx where you want to go, and our AI will instantly generate a complete, day-by-day travel itinerary tailored to your budget and style.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="button-primary">
                  Start planning
                </Link>
                <Link href="/login" className="button-secondary">
                  Open dashboard
                </Link>
              </div>
              <div className="mt-12 overflow-hidden relative w-full pt-4 pb-2 mask-edges">
                <div className="flex w-max animate-scroll gap-8">
                  {/* First set */}
                  <div className="flex gap-8 whitespace-nowrap items-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                    <span>🌍 Tokyo, Japan</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a59]"></span>
                    <span>🗼 Paris, France</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#35c6b3]"></span>
                    <span>🗽 New York, USA</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffd166]"></span>
                    <span>🏛️ Rome, Italy</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a59]"></span>
                    <span>🏝️ Bali, Indonesia</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#35c6b3]"></span>
                    <span>🐫 Dubai, UAE</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffd166]"></span>
                  </div>
                  {/* Duplicate set for seamless loop */}
                  <div className="flex gap-8 whitespace-nowrap items-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                    <span>🌍 Tokyo, Japan</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a59]"></span>
                    <span>🗼 Paris, France</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#35c6b3]"></span>
                    <span>🗽 New York, USA</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffd166]"></span>
                    <span>🏛️ Rome, Italy</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a59]"></span>
                    <span>🏝️ Bali, Indonesia</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#35c6b3]"></span>
                    <span>🐫 Dubai, UAE</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffd166]"></span>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Link href="/signup" className="panel-soft block rounded-[1.5rem] p-5 text-left relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(255,122,89,0.15)] hover:border-[#ff7a59]/40">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff7a59]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <svg className="w-6 h-6 text-[#ff7a59] mb-3 relative z-10 transition-transform duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)] relative z-10">Instant Plans</p>
                <p className="mt-1 text-xl font-bold text-[var(--foreground)] relative z-10">AI Itineraries</p>
              </Link>
              <Link href="/signup" className="panel-soft block rounded-[1.5rem] p-5 text-left relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(53,198,179,0.15)] hover:border-[#35c6b3]/40">
                <div className="absolute inset-0 bg-gradient-to-br from-[#35c6b3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <svg className="w-6 h-6 text-[#35c6b3] mb-3 relative z-10 transition-transform duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)] relative z-10">Detailed</p>
                <p className="mt-1 text-xl font-bold text-[var(--foreground)] relative z-10">Daily Schedules</p>
              </Link>
              <Link href="/signup" className="panel-soft block rounded-[1.5rem] p-5 text-left relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(255,209,102,0.15)] hover:border-[#ffd166]/40">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffd166]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <svg className="w-6 h-6 text-[#ffd166] mb-3 relative z-10 transition-transform duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)] relative z-10">Tailored</p>
                <p className="mt-1 text-xl font-bold text-[var(--foreground)] relative z-10">Smart Budgets</p>
              </Link>
            </div>

            <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-[var(--line-strong)] relative h-48 w-full group transition-all">
              <img
                src="/hero1.jpg"
                alt="Travel experience"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#35c6b3] dark:text-[#26d0b8]">Smart savings</p>
                  <p className="mt-1 text-lg font-bold text-white">Experience more.</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="panel-soft rounded-[1.5rem] p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-[#35c6b3] mb-2">Save hours of planning</p>
                <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">No more switching between tabs and maps.</p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  Our AI combines real-world travel data to give you a logical day-by-day plan. Know exactly where to go, how much it will cost, and what to see without the endless research.
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-12 flex flex-col gap-4 lg:col-span-5 animate-fade-in-up delay-100 h-full">
            <div className="relative h-64 w-full overflow-hidden rounded-[2rem] border border-[var(--line-strong)] lg:h-auto lg:min-h-[260px] animate-float-slow group">
              <img
                src="/hero2.jpg"
                alt="Beautiful travel destination"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff855f]">Endless exploration</p>
                <p className="mt-1 text-lg font-bold text-white">Lago di Braies, Italy</p>
              </div>
            </div>

            <div id="how-it-works" className="panel scroll-mt-28 rounded-[2rem] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[#ffd166]">How it works</p>
              <div className="mt-6 space-y-4">
                {features.map((feature) => (
                  <div key={feature.title} className="rounded-[1.4rem] border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
                    <h2 className="text-lg font-bold text-[var(--foreground)]">{feature.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-soft rounded-[2rem] p-6 flex flex-col justify-center border-[#35c6b3]/20 bg-[#35c6b3]/5 flex-1 min-h-[200px]">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#35c6b3]">System Ready</p>
              </div>
              <p className="text-2xl font-bold text-[var(--foreground)] leading-tight">Start your journey today.</p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">Join thousands of travelers planning their next trip in seconds.</p>
              <Link href="/signup" className="button-primary mt-6 w-max">
                Create free account
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] animate-fade-in-up delay-200">
          <div className="panel rounded-[2rem] p-6 sm:p-8 hover:shadow-[0_0_30px_rgba(255,133,95,0.15)] transition-all duration-500">
            <span className="eyebrow mb-4">Your Travel Toolkit</span>
            <div className="space-y-4">
              <div className="flex gap-4 rounded-[1.4rem] border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black/10 dark:bg-white/10 font-bold text-[var(--foreground)]">
                  <svg className="w-5 h-5 text-[#ff7a59]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                </div>
                <div>
                  <p className="font-bold text-[var(--foreground)]">Global Destinations</p>
                  <p className="text-sm leading-6 text-[var(--muted)] mt-1">Works for any city or country worldwide.</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-[1.4rem] border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black/10 dark:bg-white/10 font-bold text-[var(--foreground)]">
                  <svg className="w-5 h-5 text-[#35c6b3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-[var(--foreground)]">Time Management</p>
                  <p className="text-sm leading-6 text-[var(--muted)] mt-1">Logical daily breakdown of activities.</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-[1.4rem] border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black/10 dark:bg-white/10 font-bold text-[var(--foreground)]">
                  <svg className="w-5 h-5 text-[#ffd166]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                </div>
                <div>
                  <p className="font-bold text-[var(--foreground)]">Saved History</p>
                  <p className="text-sm leading-6 text-[var(--muted)] mt-1">Keep all your generated trips in your profile.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="panel-soft rounded-[2rem] p-6 sm:p-8 hover:shadow-[0_0_30px_rgba(53,198,179,0.15)] transition-all duration-500">
            <span className="eyebrow mb-4">Why users stay</span>
            <p className="section-title text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
              Better planning starts with a better feeling interface.
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
              Travelyx takes the guesswork out of vacation planning. Whether it&apos;s a romantic weekend in Paris or a 14-day adventure through Japan, get a complete plan in seconds.
            </p>
            <Link href="/signup" className="button-primary mt-8">
              Build your next trip
            </Link>
          </div>
        </section>
      </main>

      <footer className="shell mt-14 border-t border-black/10 dark:border-white/10 pt-6">
        <div className="rounded-[1.8rem] border border-black/10 dark:border-white/10 bg-gradient-to-br from-white/6 to-white/3 px-5 py-8 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div className="pr-4 border-b border-black/10 dark:border-white/10 pb-6 lg:border-b-0 lg:border-r lg:pb-0">
              <Link href="/" className="flex items-center gap-3 group w-max">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden group-hover:-translate-y-1 transition-transform rounded-2xl shadow-md bg-[#09090b] border border-[#27272a]">
                  <Logo className="w-8 h-8" />
                </div>
                <div>
                  <p className="display-font text-2xl font-bold tracking-tight text-[var(--foreground)]">Travelyx</p>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--muted)]">Travel AI Studio</p>
                </div>
              </Link>
              <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)]">
                AI travel planning for modern city breaks and destination journeys. Fully dynamic structure, safe profile management, and mobile-ready UI. Let AI map out your perfect trip while you focus on the packing.
              </p>
              <div className="mt-6 flex gap-4">
                <Link href="/login" className="text-sm font-bold text-[#ff855f] hover:text-[#ff9c7a] hover:underline underline-offset-4">Get Started Today →</Link>
              </div>
            </div>

            <div className="lg:pl-4">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#35c6b3]">Platform</p>
              <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-[var(--muted)]">
                <Link href="/login" className="hover:text-[var(--foreground)] transition-colors">Access your Dashboard</Link>
                <Link href="/signup" className="hover:text-[var(--foreground)] transition-colors">Create a free account</Link>
                <Link href="#how-it-works" className="hover:text-[var(--foreground)] transition-colors">How the AI planner works</Link>
              </div>
            </div>

            <div className="lg:pl-4">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--muted)]">Legal & Support</p>
              <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-[var(--muted)]">
                {footerLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="hover:text-[var(--foreground)] transition-colors">
                    {link.label}
                  </Link>
                ))}
                <span className="mt-2 block text-xs leading-5 text-slate-500">
                  By using this app, you agree to our policies. Powered by Llama 3 via Groq SDK.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-black/10 dark:border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
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
