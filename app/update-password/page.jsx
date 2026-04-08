"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {});

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
        if (exchangeError) {
          setError("Recovery link expired or invalid. Please request a new one.");
        } else {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      });
    } else if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));

      if (hashParams.has("error_description")) {
        setError(hashParams.get("error_description")?.replace(/\+/g, " ") || "Invalid recovery link.");
      } else if (hashParams.has("access_token") && hashParams.has("refresh_token")) {
        supabase.auth
          .setSession({
            access_token: hashParams.get("access_token"),
            refresh_token: hashParams.get("refresh_token"),
          })
          .then(({ error: sessionError }) => {
            if (sessionError) {
              setError("Failed to establish a secure recovery session.");
            } else {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          });
      }
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword.trim() || !confirmPassword.trim()) {
      return setError("Please fill in both password fields.");
    }

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
        return;
      }

      let notificationText = "";
      try {
        const notifyResponse = await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "password_changed" }),
        });

        if (notifyResponse.ok) {
          notificationText = " A confirmation email was sent.";
        }
      } catch (notifyError) {
        console.error("Password notification email failed:", notifyError);
      }

      setMessage(`Password updated successfully.${notificationText} Redirecting to dashboard...`);
      setTimeout(() => router.push("/dashboard"), 1800);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="panel w-full max-w-3xl rounded-[2rem] p-6 sm:p-8">
        <div className="max-w-2xl">
          <span className="eyebrow">Create new password</span>
          <h1 className="section-title mt-5 text-4xl font-bold text-white">Finish your password reset securely.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
            Enter a strong new password. After a successful update, Travelyx will try to send a confirmation email if your email provider is configured.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="mt-6 max-w-xl space-y-4">
          {error && <div className="status-error">{error}</div>}
          {message && <div className="status-success">{message}</div>}

          {!message && (
            <>
              <div>
                <label className="field-label">New password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="field" />
              </div>
              <div>
                <label className="field-label">Confirm password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="field" />
              </div>
              <button type="submit" disabled={loading} className="button-primary">
                {loading ? "Saving..." : "Update password"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
