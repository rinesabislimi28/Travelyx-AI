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
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return setError("Password must be at least 6 characters and contain letters, numbers, and a special character (@$!%*#?&).");
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
    <div className="relative flex justify-center items-center min-h-screen p-4 font-sans bg-[#f8fafc] overflow-hidden">
      {/* Premium Bright Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-800 rounded-b-[4rem] shadow-2xl z-0"></div>
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-indigo-500/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>

      {/* Floating Back Button */}
      <Link href="/" className="absolute top-6 left-6 z-20 text-white/90 hover:text-white flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full transition-all border border-white/20 shadow-lg">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Home
      </Link>

      <div className="relative z-10 bg-white/95 backdrop-blur-xl border border-white/80 p-10 rounded-3xl shadow-[0_20px_50px_rgba(30,30,80,0.08)] w-full max-w-md flex flex-col gap-6 transition-all duration-500">

        {/* Header */}
        <div className="text-center">
          {!needsVerification && <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg shadow-indigo-500/30 text-white">🚀</div>}
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
            {needsVerification ? "Verify Email" : "Create Account"}
          </h1>
          <p className="text-slate-500 font-medium">
            {needsVerification ? `We sent a code to ${email}` : "Join Travelyx-AI and start exploring."}
          </p>
        </div>

        {/* Global Error Display */}
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl text-sm text-center font-bold mt-2">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 p-4 rounded-xl text-sm text-center font-bold flex-col flex items-center justify-center gap-2 mt-2">
            {!success.includes("check your email") && (
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            )}
            {success.includes("check your email") && <span className="text-3xl animate-bounce">📩</span>}
            <span className="mt-1 text-center">{success}</span>
          </div>
        )}

        {/* Form Container */}
        {!needsVerification ? (
          <form onSubmit={handleSignUp} className="flex flex-col gap-4 mt-2">
            <div>
              <label className="block text-slate-500 text-xs font-black uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <input
                type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all placeholder:text-slate-400 placeholder:font-normal"
                required
              />
            </div>
            <div>
              <label className="block text-slate-500 text-xs font-black uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <input
                type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all placeholder:text-slate-400 placeholder:font-normal"
                required
              />
            </div>
            <div>
              <label className="block text-slate-500 text-xs font-black uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <input
                type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all placeholder:text-slate-400 placeholder:font-normal"
                required minLength={6}
              />
            </div>

            <button type="submit" disabled={loading || success.includes("check your email")} className="mt-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black p-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5 mt-2">
            <div>
              <label className="block text-slate-500 text-xs font-black uppercase tracking-widest mb-1.5 ml-1 text-center">Enter Verification Code</label>
              <input
                type="text" maxLength={8} placeholder="12345678" value={otp} onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 text-center text-3xl font-black tracking-[0.2em] transition-all placeholder:text-slate-300"
                required
              />
            </div>
            <button type="submit" disabled={loading || !!success.includes("verified")} className="mt-2 w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black p-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm">
              {loading && !success.includes("verified") ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        )}

        {/* Footer Navigation */}
        {!needsVerification && (
          <div className="flex flex-col gap-3 mt-1 border-t border-slate-100 pt-5">
            <p className="text-sm font-medium text-center text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-bold transition-colors underline decoration-indigo-200 underline-offset-4">
                Login here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}