"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "../components/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("travelyx_remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (rememberMe) {
        localStorage.setItem("travelyx_remember_email", email);
      } else {
        localStorage.removeItem("travelyx_remember_email");
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="floating-orb one" />
      <div className="w-full max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="top-nav-link">
            <span aria-hidden="true">←</span>
            Back to home
          </Link>
          <div className="flex items-center gap-3 select-none">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-md bg-[#09090b] border border-[#27272a]">
              <Logo className="w-6 h-6" />
            </div>
            <div>
              <p className="display-font text-xl font-bold tracking-tight text-[var(--foreground)] leading-none mb-1">Travelyx</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--muted)] leading-none">Travel AI Studio</p>
            </div>
          </div>
        </div>
        <div className="panel w-full overflow-hidden rounded-[2rem]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="border-b border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="mt-10">
                <span className="eyebrow">Welcome back</span>
                <h1 className="section-title mt-5 text-4xl font-bold text-[var(--foreground)] sm:text-5xl">
                  Log in and keep building your next trip.
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                  The refreshed dashboard keeps your trips, budgets, and itinerary history in one clean workspace that works properly on mobile too.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Account access</p>
                <h2 className="mt-3 text-3xl font-bold text-[var(--foreground)]">Sign in</h2>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {error && <div className="status-error">{error}</div>}

                <div>
                  <label className="field-label">Email address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="field"
                    required
                  />
                </div>

                <div>
                  <label className="field-label">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="field"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 appearance-none rounded border border-[var(--line-strong)] bg-[var(--card)] checked:bg-[#35c6b3] checked:border-[#35c6b3] focus:ring-1 focus:ring-[#35c6b3] focus:outline-none cursor-pointer transition-colors relative after:content-[''] checked:after:absolute checked:after:left-[5px] checked:after:top-[2px] checked:after:w-[5px] checked:after:h-[9px] checked:after:border-r-2 checked:after:border-b-2 checked:after:border-slate-900 checked:after:rotate-45"
                  />
                  <label htmlFor="rememberMe" className="text-sm font-medium text-[var(--muted)] cursor-pointer select-none">
                    Remember my email
                  </label>
                </div>

                <button type="submit" disabled={loading} className="button-primary mt-3 w-full">
                  {loading ? "Signing in..." : "Log in"}
                </button>
              </form>

              <div className="mt-6 space-y-3 text-sm text-[var(--muted)]">
                <p>
                  Forgot your password?{" "}
                  <Link href="/forgot-password" className="font-bold text-[#ffd166]">
                    Reset it here
                  </Link>
                </p>
                <p>
                  Need an account?{" "}
                  <Link href="/signup" className="font-bold text-[#35c6b3]">
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
