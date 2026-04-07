"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    if (!email.includes("@")) return setError("Please enter a valid email address.");

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
        <div className="mb-4">
          <Link href="/" className="top-nav-link">
            <span aria-hidden="true">←</span>
            Back to home
          </Link>
        </div>
      <div className="panel w-full overflow-hidden rounded-[2rem]">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-white/10 bg-white/5 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="mt-10">
              <span className="eyebrow">Join Travelyx</span>
              <h1 className="section-title mt-5 text-4xl font-bold text-white sm:text-5xl">
                Create a cleaner travel planning workspace.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Save trips, revisit itineraries, and manage your profile inside a stronger interface built for desktop and phone screens.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                {needsVerification ? "Email verification" : "Create account"}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                {needsVerification ? "Verify your code" : "Get started"}
              </h2>
            </div>

            {error && <div className="status-error mb-4">{error}</div>}
            {success && <div className="status-success mb-4">{success}</div>}

            {!needsVerification ? (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="field-label">Full name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="field" required />
                </div>
                <div>
                  <label className="field-label">Email address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" required />
                </div>
                <div>
                  <label className="field-label">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" required />
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
              <p className="mt-6 text-sm text-slate-300">
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
