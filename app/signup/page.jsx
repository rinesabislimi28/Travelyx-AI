/**
 * Signup Page
 * 
 * Handles new user registration via Supabase Auth. Validates passwords and redirects 
 * successful registrations directly to the dashboard planner.
 */
"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "../components/Logo";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) return setError("Please enter your full name.");
    
    // Strict Email Validation (Format + Allowed Providers)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address.");
    }
    
    // Për të garantuar që kodi OTP shkon në një adresë të vërtetë, lejojmë vetëm domain-e të njohura
    const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "live.com", "proton.me"];
    const emailDomain = email.split("@")[1].toLowerCase();
    if (!allowedDomains.includes(emailDomain)) {
      return setError(`Please use a real email provider (${allowedDomains.join(", ")}).`);
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return setError("Password must be at least 6 characters and include a letter, number, and special character.");
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name.trim() } },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else if (data?.session) {
        setSuccess("Account created successfully. Redirecting to login...");
        setTimeout(() => router.push("/login"), 1400);
      } else {
        setNeedsVerification(true);
        setSuccess(`We sent a verification code to ${email}.`);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (otp.length < 6) return setError("Please enter the verification code.");

    setLoading(true);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      });

      if (verifyError) {
        setError(verifyError.message);
      } else {
        setSuccess("Email verified successfully. Redirecting to login...");
        setTimeout(() => router.push("/login"), 1400);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while verifying the code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="floating-orb two" />
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
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="border-b border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="mt-10">
                <span className="eyebrow">Join Travelyx</span>
                <h1 className="section-title mt-5 text-4xl font-bold text-[var(--foreground)] sm:text-5xl">
                  Create a cleaner travel planning workspace.
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                  Save trips, revisit itineraries, and manage your profile inside a stronger interface built for desktop and phone screens.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">
                  {needsVerification ? "Email verification" : "Create account"}
                </p>
                <h2 className="mt-3 text-3xl font-bold text-[var(--foreground)]">
                  {needsVerification ? "Verify your code" : "Get started"}
                </h2>
              </div>

              {error && <div className="status-error mb-4">{error}</div>}
              {success && <div className="status-success mb-4">{success}</div>}

              {!needsVerification ? (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="field-label">Full name</label>
                    <input type="text" placeholder="Gjoni Doe" value={name} onChange={(e) => setName(e.target.value)} className="field" required />
                  </div>
                  <div>
                    <label className="field-label">Email address</label>
                    <input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="field" required />
                  </div>
                  <div>
                    <label className="field-label">Password</label>
                    <input type="password" placeholder="Min 6 characters, numbers & symbols" value={password} onChange={(e) => setPassword(e.target.value)} className="field" required />
                  </div>
                  <button type="submit" disabled={loading} className="button-primary mt-2 w-full">
                    {loading ? "Creating account..." : "Create account"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="field-label">Verification code</label>
                    <input
                      type="text"
                      maxLength={8}
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="field text-center text-2xl font-bold tracking-[0.3em]"
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="button-primary mt-2 w-full">
                    {loading ? "Verifying..." : "Verify code"}
                  </button>
                </form>
              )}

              {!needsVerification && (
                <p className="mt-6 text-sm text-[var(--muted)]">
                  Already have an account?{" "}
                  <Link href="/login" className="font-bold text-[#ffd166]">
                    Log in
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
