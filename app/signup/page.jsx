/**
 * SignupPage Component
 * -------------------
 * Provides a highly polished signup form utilizing Supabase Authentication.
 * Includes basic validation (email structure, minimum password length, and name field)
 * and an advanced Email Verification (OTP Code) step.
 */
"use client";
import Image from "next/image";
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

  // --- OTP Verification State ---
  const [needsVerification, setNeedsVerification] = useState(false);
  const [otp, setOtp] = useState("");

  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) return setError("Please enter your full name.");
    if (!email.includes("@")) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name.trim() } },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
      } else if (data?.session) {
        // [SMART BYPASS] User turned off "Confirm Email" in Supabase Dashboard!
        // No email code is required, log them in instantly.
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        // [OTP REQUIRED] User has "Confirm Email" ON in Supabase Dashboard.
        setNeedsVerification(true);
        setSuccess("Account created! Please check your email inbox (and SPAM) for the verification code.");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (otp.length < 6) return setError("Please enter the valid verification code.");

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
        setSuccess("Email verified successfully! Redirecting...");
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (err) {
      setError("An unexpected error occurred verifying the code.");
    } finally {
      if (!success) setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen p-4 font-sans overflow-hidden bg-slate-950">
      {/* Pure CSS Dynamic Travel Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft glowing orbs representing destinations */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/20 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
        {/* CSS Pattern (Dotted map grid illusion) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px]"></div>
      </div>

      {/* Floating Back Button */}
      <Link href="/" className="absolute top-6 left-6 z-20 text-white/70 hover:text-white flex items-center gap-2 text-sm font-medium bg-black/30 hover:bg-black/50 backdrop-blur-md px-4 py-2 rounded-full transition-all border border-white/10">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Home
      </Link>

      <div className="relative z-10 bg-slate-950/60 backdrop-blur-xl border border-slate-700/50 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-6 transition-all duration-500">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            {needsVerification ? "Verify Email" : "Create Account"}
          </h1>
          <p className="text-indigo-200">
            {needsVerification ? `We sent a code to ${email}` : "Join Travelyx-AI and start exploring."}
          </p>
        </div>

        {/* Global Error / Success Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-lg text-sm text-center font-medium mt-2">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-100 p-3 rounded-lg text-sm text-center font-medium flex-col flex items-center justify-center gap-2 mt-2">
            {!success.includes("check your email") && (
              <div className="w-5 h-5 border-2 border-green-100 border-t-transparent rounded-full animate-spin"></div>
            )}
            {success.includes("check your email") && <span className="text-3xl animate-bounce">📩</span>}
            <span className="mt-1 text-center">{success}</span>
          </div>
        )}

        {/* Form Container */}
        {!needsVerification ? (
          <form onSubmit={handleSignUp} className="flex flex-col gap-5 mt-2">
            <div>
              <label className="block text-indigo-100 text-sm mb-1 ml-1 font-medium">Full Name</label>
              <input
                type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-indigo-100 text-sm mb-1 ml-1 font-medium">Email Address</label>
              <input
                type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-indigo-100 text-sm mb-1 ml-1 font-medium">Password</label>
              <input
                type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-gray-400"
                required minLength={6}
              />
            </div>

            <button type="submit" disabled={loading || success.includes("check your email")} className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5 mt-2">
            <div>
              <label className="block text-indigo-100 text-sm mb-1 ml-1 font-medium text-center">Enter Verification Code</label>
              <input
                type="text" maxLength={8} placeholder="12345678" value={otp} onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 text-white text-center text-2xl tracking-widest rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-gray-500"
                required
              />
            </div>
            <button type="submit" disabled={loading || !!success.includes("verified")} className="mt-2 w-full bg-green-600 hover:bg-green-500 text-white font-bold p-3.5 rounded-xl shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading && !success.includes("verified") ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        )}

        {/* Footer Navigation */}
        {!needsVerification && (
          <p className="text-sm text-center text-indigo-200 mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:text-indigo-400 font-semibold transition-colors underline decoration-indigo-400/30 underline-offset-4">
              Login here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}