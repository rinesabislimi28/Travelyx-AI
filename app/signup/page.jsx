/**
 * SignupPage Component
 * -------------------
 * Provides a highly polished signup form utilizing Supabase Authentication.
 * Includes basic validation (email structure, minimum password length, and name field)
 * and detailed error handling + success redirect delays.
 */
"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");        // User email input
  const [password, setPassword] = useState("");  // User password input
  const [name, setName] = useState("");          // User full name input
  const [error, setError] = useState("");        // Error message display
  const [success, setSuccess] = useState("");    // Success message display
  const [loading, setLoading] = useState(false); // Submit button state
  const router = useRouter();

  /**
   * handleSignUp
   * Registers a new user with Supabase. Includes the full_name in the metadata.
   */
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 1. Basic Front-End Validation
    if (!name.trim()) return setError("Please enter your full name.");
    if (!email.includes("@")) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);

    try {
      // 2. Call Supabase Sign Up API & attach metadata (name)
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name.trim() } },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        // 3. Display success and redirect user to login
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      if (!success) setLoading(false); // Only reset if not redirecting
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Create Account</h1>
          <p className="text-indigo-200">Join Travelyx-AI and start exploring.</p>
        </div>

        {/* Form Elements */}
        <form onSubmit={handleSignUp} className="flex flex-col gap-5 mt-2">
          
          {/* Error / Success Messages */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-100 p-3 rounded-lg text-sm text-center font-medium flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-green-100 border-t-transparent rounded-full animate-spin"></div>
              {success}
            </div>
          )}

          <div>
            <label className="block text-indigo-100 text-sm mb-1 ml-1 font-medium">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full p-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-gray-400" 
              required
            />
          </div>

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
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !!success}
            className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && !success ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer Navigation */}
        <p className="text-sm text-center text-indigo-200 mt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:text-indigo-400 font-semibold transition-colors underline decoration-indigo-400/30 underline-offset-4">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}