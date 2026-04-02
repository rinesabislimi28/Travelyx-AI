"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.includes("@")) {
      return setError("Please enter a valid email address.");
    }

    setLoading(true);

    try {
      // By default, Supabase sends a password reset link to this email
      // Needs to have App URL and SITE_URL configured correctly in Supabase settings
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`, // Redirect to dedicated password update page
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage("Check your email! We've sent you a password reset link.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen p-4 font-sans bg-[#f8fafc] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[250px] md:h-[350px] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-800 rounded-b-[3rem] md:rounded-b-[4rem] shadow-2xl z-0 transition-all duration-300"></div>
      <div className="absolute top-[10%] left-[10%] md:left-[20%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-indigo-500/20 blur-[80px] md:blur-[100px] rounded-full z-0 pointer-events-none"></div>

      {/* Floating Back Button */}
      <Link href="/login" className="absolute top-4 left-4 md:top-6 md:left-6 z-20 text-white/90 hover:text-white flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 md:px-5 md:py-2.5 rounded-full transition-all border border-white/20 shadow-lg">
        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span className="hidden sm:inline">Back to Login</span>
        <span className="sm:hidden">Back</span>
      </Link>

      <div className="relative z-10 bg-white/95 backdrop-blur-xl border border-white/80 p-6 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(30,30,80,0.08)] w-full max-w-md flex flex-col gap-5 md:gap-6 mt-8 md:mt-0">
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg shadow-indigo-500/30 text-white">🔒</div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Reset Password</h1>
          <p className="text-slate-500 font-medium text-sm">Enter your account email to receive a secure recovery link.</p>
        </div>

        <form onSubmit={handleResetPassword} className="flex flex-col gap-5 mt-2">
          
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl text-sm text-center font-bold animate-fade-in mt-2">
              {error}
            </div>
          )}
          
          {message && (
            <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 p-4 rounded-xl text-sm text-center font-bold animate-fade-in flex flex-col gap-2">
              <span className="text-3xl">📬</span>
              {message}
            </div>
          )}

          {!message && (
            <>
              <div>
                <label className="block text-slate-500 text-xs font-black uppercase tracking-widest mb-1.5 ml-1">Verified Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all placeholder:text-slate-400 placeholder:font-normal"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black p-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
              >
                {loading ? "Transmitting..." : "Send Recovery Link"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
