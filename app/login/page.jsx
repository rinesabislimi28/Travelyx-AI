/**
 * LoginPage Component
 * -------------------
 * Provides a highly polished login form utilizing Supabase Authentication.
 * Includes basic validation (email structure, minimum password length)
 * and detailed error handling.
 */
"use client";
import Image from "next/image";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Efficient client-side navigation

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * handleLogin
   * Authenticates the user with Supabase using email & password.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Basic Front-End Validation
    if (!email.includes("@")) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);

    try {
      // 2. Authenticate with Supabase
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        return;
      }

      // 3. Supabase sets the persistent session automatically in local storage.
      // 4. Redirect the user to the protected dashboard route.
      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen p-4 font-sans bg-slate-50 overflow-hidden">
      {/* Professional Dark Header Background */}
      <div className="absolute top-0 left-0 w-full h-[350px] bg-slate-900 rounded-b-[4rem] shadow-xl z-0"></div>

      {/* Floating Back Button */}
      <Link href="/" className="absolute top-6 left-6 z-20 text-slate-300 hover:text-white flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full transition-all border border-white/20 shadow-sm">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Home
      </Link>

      <div className="relative z-10 bg-white hover-float p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-md flex flex-col gap-5 sm:gap-6 transition-all duration-300">

        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg shadow-indigo-500/30 text-white">✈️</div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Sign in to plan your next adventure.</p>
        </div>

        {/* Form Elements */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5 mt-2">

          {/* Error Message Display */}
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl text-sm text-center font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-500 text-xs font-black uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all placeholder:text-slate-400 placeholder:font-normal"
              required
            />
          </div>

          <div>
            <label className="block text-slate-500 text-xs font-black uppercase tracking-widest mb-1.5 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all placeholder:text-slate-400 placeholder:font-normal"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black p-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
          >
            {loading ? "Signing in..." : "Login to Travelyx-AI"}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="flex flex-col gap-3 mt-2 border-t border-slate-100 pt-5">
          <p className="text-sm font-medium text-center text-slate-500">
            Forgot your password?{" "}
            <Link href="/forgot-password" className="text-blue-600 hover:text-blue-500 font-bold transition-colors underline decoration-blue-200 underline-offset-4">
              Reset it here
            </Link>
          </p>
          <p className="text-sm font-medium text-center text-slate-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-bold transition-colors underline decoration-blue-200 underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}