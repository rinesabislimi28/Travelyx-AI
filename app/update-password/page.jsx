"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Supabase needs time to parse the `#access_token=...` hash from the email link.
    // If we aggressively check getSession() too early, it will resolve as null and kick the user out.
    // Instead, we let the component render and optionally listen to auth state changes.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event in Update Password:", event);
      if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery token parsed perfectly.");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

      if (updateError) {
        setError(updateError.message);
      } else {
        setMessage("Password successfully reset! You will be redirected to dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen p-4 font-sans bg-[#f8fafc] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-800 rounded-b-[4rem] shadow-2xl z-0"></div>

      <div className="relative z-10 bg-white/95 backdrop-blur-xl border border-white/80 p-8 rounded-3xl shadow-[0_20px_50px_rgba(30,30,80,0.08)] w-full max-w-md flex flex-col gap-6">
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg shadow-indigo-500/30 text-white">🔑</div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Create New Password</h1>
          <p className="text-slate-500 text-sm font-medium">Please enter your new secure password below.</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-5">
          {error && <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl text-sm text-center font-bold">{error}</div>}
          {message && <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 p-3 rounded-xl text-sm text-center font-bold">{message}</div>}

          {!message && (
            <>
              <div>
                <label className="block text-slate-500 text-xs font-black uppercase tracking-widest mb-1.5 ml-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all placeholder:text-slate-400 placeholder:font-normal"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 text-xs font-black uppercase tracking-widest mb-1.5 ml-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all placeholder:text-slate-400 placeholder:font-normal"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black p-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
              >
                {loading ? "Saving..." : "Update Password"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
