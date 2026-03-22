/**
 * LoginPage Component
 * -------------------
 * Provides a highly polished login form utilizing Supabase Authentication.
 * Includes basic validation (email structure, minimum password length)
 * and detailed error handling.
 */
"use client";
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
      // 4. Redirect the user to the protected dashboard/home route.
      router.push("/");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Welcome Back</h1>
          <p className="text-indigo-200">Sign in to plan your next adventure.</p>
        </div>

        {/* Form Elements */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5 mt-2">
          
          {/* Error Message Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-indigo-100 text-sm mb-1 ml-1 font-medium">Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-gray-400" 
              required
            />
          </div>

          <div>
            <label className="block text-indigo-100 text-sm mb-1 ml-1 font-medium">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-gray-400" 
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Login to Travelyx-AI"}
          </button>
        </form>

        {/* Footer Navigation */}
        <p className="text-sm text-center text-indigo-200 mt-2">
          Don't have an account?{" "}
          <Link href="/signup" className="text-white hover:text-indigo-400 font-semibold transition-colors underline decoration-indigo-400/30 underline-offset-4">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}