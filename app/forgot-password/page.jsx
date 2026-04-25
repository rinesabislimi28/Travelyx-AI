"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.includes("@")) {
      return setError("Please enter a valid email address.");
    }

    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);

      if (resetError) {
        setError(resetError.message);
      } else {
        setNeedsVerification(true);
        setMessage(`We sent a recovery code to ${email}.`);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (otp.length < 6) return setError("Please enter the 6-digit code.");

    setLoading(true);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "recovery",
      });

      if (verifyError) {
        setError(verifyError.message);
      } else {
        setMessage("Code verified. Redirecting to create a new password...");
        setTimeout(() => router.push("/update-password"), 1200);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while verifying the code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl mb-5">
        <Link href="/login" className="top-nav-link">
          <span aria-hidden="true">←</span>
          Back to login
        </Link>
      </div>

      <div className="panel w-full max-w-3xl rounded-[2rem] p-6 sm:p-8">
        <div className="max-w-2xl">
          <span className="eyebrow">Password recovery</span>
          <h1 className="section-title mt-5 text-4xl font-bold text-[var(--foreground)]">
            Reset your password without losing the flow.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
            Enter your email, confirm the recovery code, then set a new password. If custom email notifications are configured, the app also sends a password-changed notice after the reset is completed.
          </p>
          <div className="mt-4 inline-block rounded-xl border border-[#35c6b3]/30 bg-[#35c6b3]/10 px-4 py-3">
            <p className="text-sm font-bold text-[#35c6b3]">
              ℹ️ Note: The password reset will be strictly performed for the exact email address you enter below.
            </p>
          </div>
        </div>

        {error && <div className="status-error mt-6">{error}</div>}
        {message && <div className="status-success mt-6">{message}</div>}

        {!needsVerification ? (
          <form onSubmit={handleResetPassword} className="mt-6 max-w-xl space-y-4">
            <div>
              <label className="field-label">Account email</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="field" required />
            </div>
            <button type="submit" disabled={loading} className="button-primary">
              {loading ? "Sending code..." : "Send recovery code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-6 max-w-xl space-y-4">
            <div>
              <label className="field-label">Recovery code</label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="field text-center text-2xl font-bold tracking-[0.3em]"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="button-primary">
              {loading ? "Verifying..." : "Verify code"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
