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
    // Escalate immediately on Auth State Change
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event in Update Password:", event);
      if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery token parsed perfectly.");
      }
    });

    // Handle PKCE code exchange manually if present in URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setError("Recovery link expired or invalid! Please request a new link.");
        }
        // Remove code from URL after exchange
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    } else if (window.location.hash) {
       const hashStr = window.location.hash.substring(1);
       const hashParams = new URLSearchParams(hashStr);
       
       if (hashParams.has("error_description")) {
         setError(hashParams.get("error_description")?.replace(/\+/g, " ") || "Invalid recovery link.");
       } else if (hashParams.has("access_token") && hashParams.has("refresh_token")) {
         // Bulletproof implicit flow session setting
         supabase.auth.setSession({
           access_token: hashParams.get("access_token"),
           refresh_token: hashParams.get("refresh_token")
         }).then(({ error }) => {
           if (error) {
             setError("Failed to establish secure session from link.");
           } else {
             window.history.replaceState({}, document.title, window.location.pathname);
           }
         });
       }
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return setError("Password must contain at least one letter, one number, and one special character.");
    }

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
    <div className="relative flex justify-center items-center min-h-screen p-4 font-sans bg-slate-50 overflow-hidden">
      {/* Professional Dark Header Background */}
      <div className="absolute top-0 left-0 w-full h-[350px] bg-slate-900 rounded-b-[4rem] shadow-xl z-0"></div>

      <div className="relative z-10 bg-white hover-float p-6 md:p-8 rounded-3xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-md flex flex-col gap-5 md:gap-6 transition-all duration-300">
        
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
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-black p-3.5 rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
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
