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
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="panel w-full max-w-3xl rounded-[2rem] p-6 sm:p-8">
        <Link href="/login" className="button-secondary text-sm">
          Back to login
        </Link>

        <div className="mt-8 max-w-2xl">
          <span className="eyebrow">Password recovery</span>
          <h1 className="section-title mt-5 text-4xl font-bold text-white">
            Reset your password without losing the flow.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
            Enter your email, confirm the recovery code, then set a new password. If custom email notifications are configured, the app also sends a password-changed notice after the reset is completed.
          </p>
        </div>

        {error && <div className="status-error mt-6">{error}</div>}
        {message && <div className="status-success mt-6">{message}</div>}

        {!needsVerification ? (
          <form onSubmit={handleResetPassword} className="mt-6 max-w-xl space-y-4">
            <div>
              <label className="field-label">Account email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" required />
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
