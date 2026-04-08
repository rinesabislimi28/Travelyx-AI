"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";
import Link from "next/link";

type AuthUser = {
  email?: string;
  created_at?: string;
  user_metadata?: {
    full_name?: string;
  };
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteAccountText, setDeleteAccountText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmError, setDeleteConfirmError] = useState("");
  const joinedAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "recently";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUser(user);
      setFullName(user.user_metadata?.full_name || "");
    }
    setLoading(false);
  };

  const showFeedback = (type: "success" | "error", message: string) => {
    if (type === "success") {
      setSuccessMsg(message);
      setErrorMsg("");
    } else {
      setErrorMsg(message);
      setSuccessMsg("");
    }

    setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 5000);
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || fullName === user?.user_metadata?.full_name) return;
    setIsUpdatingName(true);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName.trim() },
    });

    if (error) {
      showFeedback("error", error.message);
    } else {
      showFeedback("success", "Profile details updated successfully.");
    }
    setIsUpdatingName(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || !confirmPassword.trim()) {
      return showFeedback("error", "Please fill in both password fields.");
    }
    if (newPassword.length < 6) {
      return showFeedback("error", "Password must be at least 6 characters.");
    }
    if (newPassword !== confirmPassword) {
      return showFeedback("error", "Passwords do not match.");
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return showFeedback("error", "Password must contain at least one letter, one number, and one special character.");
    }

    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      showFeedback("error", error.message);
      setIsUpdatingPassword(false);
      return;
    }

    let emailNotice = " If email notifications are configured, a confirmation email will also be sent.";
    try {
      const notifyResponse = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "password_changed" }),
      });

      if (notifyResponse.ok) {
        emailNotice = " A confirmation email was sent to your inbox.";
      }
    } catch (notifyError) {
      console.error("Password change notification failed:", notifyError);
    }

    showFeedback("success", `Password updated successfully.${emailNotice}`);
    setNewPassword("");
    setConfirmPassword("");
    setIsUpdatingPassword(false);
  };

  const handleDeleteAccount = async () => {
    if (!deleteAccountText.trim()) {
      setDeleteConfirmError("Please type DELETE to confirm account deletion.");
      return;
    }

    if (deleteAccountText !== "DELETE") {
      setDeleteConfirmError("Confirmation text must be exactly DELETE in all caps.");
      return;
    }

    setDeleteConfirmError("");
    setIsDeleting(true);

    try {
      const sessionResponse = await supabase.auth.getSession();
      const token = sessionResponse.data.session?.access_token;

      if (!token) throw new Error("Authentication token missing.");

      const response = await fetch("/api/auth/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account from server.");
      }

      await supabase.auth.signOut();
      router.push("/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      showFeedback("error", message);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="panel rounded-[2rem] px-8 py-6">
          <p className="text-white">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-3 py-4 sm:px-4 sm:py-5">
        <div className="shell mb-4">
          <Link href="/dashboard" className="top-nav-link">
            <span aria-hidden="true">←</span>
            Back to dashboard
          </Link>
        </div>
        <div className="shell">
          <div className="panel rounded-[2rem] p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Account settings</p>
                <h1 className="section-title mt-3 text-3xl font-bold text-white sm:text-4xl">My profile</h1>
              </div>
              <div className="hidden sm:block" />
            </div>

            {successMsg && <div className="status-success mt-5">{successMsg}</div>}
            {errorMsg && <div className="status-error mt-5">{errorMsg}</div>}

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5">
                <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5 sm:p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#ffd166]">Profile overview</p>
                  <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-white/10 text-3xl font-bold text-white">
                      {(user?.user_metadata?.full_name || user?.email || "T").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{user?.user_metadata?.full_name || "Traveler"}</h2>
                      <p className="mt-1 text-sm text-slate-300">{user?.email}</p>
                      <p className="mt-3 text-sm text-slate-400">Joined {joinedAt}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5 sm:p-6">
                  <h3 className="text-xl font-bold text-white">Personal details</h3>
                  <form onSubmit={handleUpdateName} className="mt-5 space-y-4">
                    <div>
                      <label className="field-label">Full name</label>
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="field" />
                    </div>
                    <div>
                      <label className="field-label">Email address</label>
                      <input type="text" value={user?.email || ""} disabled className="field opacity-60" />
                    </div>
                    <button
                      type="submit"
                      disabled={isUpdatingName || fullName === user?.user_metadata?.full_name}
                      className="button-primary"
                    >
                      {isUpdatingName ? "Saving..." : "Save details"}
                    </button>
                  </form>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5 sm:p-6">
                  <h3 className="text-xl font-bold text-white">Security</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    Change your password here. When the email provider is configured, a password-change confirmation email is also sent.
                  </p>
                  <form onSubmit={handleUpdatePassword} className="mt-5 space-y-4">
                    <div>
                      <label className="field-label">New password</label>
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="field" />
                    </div>
                    <div>
                      <label className="field-label">Confirm password</label>
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="field" />
                    </div>
                    <button
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="button-primary"
                    >
                      {isUpdatingPassword ? "Updating..." : "Update password"}
                    </button>
                  </form>
                </div>

                <div className="rounded-[1.8rem] border border-rose-400/20 bg-rose-400/10 p-5 sm:p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-rose-200">Danger zone</p>
                  <h3 className="mt-3 text-xl font-bold text-white">Delete account</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-200">
                    This permanently removes your account and saved trips. A confirmation email is attempted after deletion when custom email delivery is configured.
                  </p>
                  <button
                    onClick={() => {
                      setDeleteConfirmError("");
                      setDeleteAccountText("");
                      setShowDeleteModal(true);
                    }}
                    className="button-danger mt-5"
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
            <div className="panel relative w-full max-w-lg rounded-[2rem] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-rose-300">Delete account</p>
              <h3 className="mt-3 text-2xl font-bold text-white">Are you sure you want to continue?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                This action cannot be undone. Type <span className="font-bold text-white">DELETE</span> to confirm permanent removal.
              </p>
              <div className="mt-5">
                <label className="field-label">Confirmation text</label>
                <input
                  value={deleteAccountText}
                  onChange={(e) => {
                    setDeleteAccountText(e.target.value);
                    if (deleteConfirmError) setDeleteConfirmError("");
                  }}
                  className="field"
                  placeholder="DELETE"
                />
              </div>
              {deleteConfirmError && <div className="status-error mt-4">{deleteConfirmError}</div>}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmError("");
                    setDeleteAccountText("");
                  }}
                  className="button-secondary flex-1"
                >
                  Cancel
                </button>
                <button onClick={handleDeleteAccount} disabled={isDeleting} className="button-danger flex-1">
                  {isDeleting ? "Deleting..." : "Yes, delete account"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
