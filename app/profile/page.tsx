/**
 * Profile Page
 * 
 * Allows users to view and edit their profile details. 
 * Supports updating name, changing passwords, and uploading an avatar image 
 * that persists in Supabase user_metadata for multi-device sync.
 */
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";
import Link from "next/link";
import Logo from "../components/Logo";
import { clearLocalAuth } from "../../lib/clearLocalAuth";

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
  const [tripCount, setTripCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);
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
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.warn("Unable to load Supabase session:", sessionError.message);
        setLoading(false);
        return;
      }

      const user = session?.user;

      if (user) {
        setUser(user);
        setFullName(user.user_metadata?.full_name || "");
      
        const { data, count, error } = await supabase.from("trips").select("id", { count: "exact" }).eq("user_id", user.id);
        if (error) console.warn("Unable to load profile trip count:", error.message);
        if (count !== null) setTripCount(count);
      
        try {
          const favs = JSON.parse(localStorage.getItem("travelyx_favorites") || "{}");
          if (data) {
            const validFavs = data.filter((trip) => favs[trip.id]).length;
            setFavoriteCount(validFavs);
          }
        } catch (e) {
          console.warn("Unable to parse favorites:", e);
        }
      }
    
      const savedAvatar = localStorage.getItem("travelyx_avatar");
      if (savedAvatar) {
        setAvatarUrl(savedAvatar);
        setPreviewAvatarUrl(savedAvatar);
      }
    } catch (error) {
      console.warn("Supabase profile request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      showFeedback("error", "Image must be less than 2MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewAvatarUrl(base64String);
    };
    reader.readAsDataURL(file);
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingName(true);
    let updated = false;

    const updateData: { full_name?: string } = {};

    if (fullName.trim() && fullName !== user?.user_metadata?.full_name) {
      updateData.full_name = fullName.trim();
    }

    if (previewAvatarUrl !== avatarUrl) {
      localStorage.setItem("travelyx_avatar", previewAvatarUrl || "");
      setAvatarUrl(previewAvatarUrl);
      updated = true;
    }

    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase.auth.updateUser({
        data: updateData,
      });
      if (error) {
        showFeedback("error", error.message);
        setIsUpdatingName(false);
        return;
      }
      updated = true;
    }

    if (updated) {
      showFeedback("success", "Profile details saved successfully.");
    } else {
      showFeedback("error", "No changes made to save.");
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
      const sessionRes = await supabase.auth.getSession();
      const token = sessionRes.data.session?.access_token;
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const notifyResponse = await fetch("/api/notifications", {
        method: "POST",
        headers,
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

      clearLocalAuth();
      router.push("/");
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
          <p className="text-[var(--foreground)]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-3 py-4 sm:px-4 sm:py-5">
        <div className="shell mb-4 flex items-center justify-between">
          <Link href="/dashboard" className="top-nav-link">
            <span aria-hidden="true">←</span>
            Back to dashboard
          </Link>
          <div className="flex items-center gap-3 select-none">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-md bg-[#09090b] border border-[#27272a]">
              <Logo className="w-6 h-6" />
            </div>
            <div>
              <p className="display-font text-xl font-bold tracking-tight text-[var(--foreground)] leading-none mb-1">Travelyx</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--muted)] leading-none">Travel AI Studio</p>
            </div>
          </div>
        </div>
        <div className="shell">
          <div className="panel rounded-[2rem] p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Account settings</p>
                <h1 className="section-title mt-3 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">Settings</h1>
              </div>
              <div className="hidden sm:block" />
            </div>

            {/* Toast Notifications */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
              {successMsg && (
                <div className="animate-[bounce_0.5s_ease-out] rounded-xl bg-[#35c6b3] px-6 py-4 text-sm font-bold text-black shadow-2xl flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="animate-[bounce_0.5s_ease-out] rounded-xl bg-red-500 px-6 py-4 text-sm font-bold text-white shadow-2xl flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                  {errorMsg}
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5">
                <div className="rounded-[1.8rem] border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#ffd166]">Profile overview</p>
                  <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="relative w-20 h-20 group cursor-pointer shrink-0">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.6rem] bg-[var(--card-strong)] text-3xl font-bold text-[var(--foreground)] ring-2 ring-[var(--line)] transition-all group-hover:ring-[#35c6b3]">
                        {previewAvatarUrl ? (
                          <img src={previewAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          (user?.user_metadata?.full_name || user?.email || "T").charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center rounded-[1.6rem] bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      </div>
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="Change profile picture" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--foreground)]">{user?.user_metadata?.full_name || "Traveler"}</h2>
                      <p className="mt-1 text-sm text-[var(--muted)]">{user?.email}</p>
                      <p className="mt-3 text-sm text-[var(--muted)]">Joined {joinedAt}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6">
                  <h3 className="text-xl font-bold text-[var(--foreground)]">Personal details</h3>
                  <form onSubmit={handleUpdateProfile} className="mt-5 space-y-4">
                    {previewAvatarUrl && previewAvatarUrl !== avatarUrl && (
                      <div className="rounded-xl border border-[#ffd166]/30 bg-[#ffd166]/10 p-3 mb-2 flex gap-3 items-center">
                        <svg className="w-5 h-5 text-[#ffd166] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        <p className="text-sm font-bold text-[#ffd166]">You have an unsaved profile picture. Click "Save details" to apply it.</p>
                      </div>
                    )}
                    <div>
                      <label className="field-label">Full name</label>
                      <input type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} className="field" />
                    </div>
                    <div>
                      <label className="field-label">Email address</label>
                      <input type="text" value={user?.email || ""} disabled className="field opacity-60" />
                    </div>
                    <button
                      type="submit"
                      disabled={isUpdatingName}
                      className="button-primary"
                    >
                      {isUpdatingName ? "Saving..." : "Save details"}
                    </button>
                  </form>
                </div>

                <div className="rounded-[1.8rem] border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-[var(--foreground)]">Your Travel Stats</h3>
                    <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-wider text-emerald-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      Private Data
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-7 text-[var(--muted)]">
                    A summary of your generated itineraries. All your data is deeply encrypted and 100% private.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--background)] p-4 text-center shadow-inner">
                      <p className="text-3xl font-black text-[#35c6b3]">{tripCount}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[var(--muted)] font-bold">Total Trips</p>
                    </div>
                    <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--background)] p-4 text-center shadow-inner">
                      <p className="text-3xl font-black text-[#ffd166]">{favoriteCount}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[var(--muted)] font-bold">Favorites</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[1.8rem] border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6">
                  <h3 className="text-xl font-bold text-[var(--foreground)]">Security</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                    Change your password here. When the email provider is configured, a password-change confirmation email is also sent.
                  </p>
                  <form onSubmit={handleUpdatePassword} className="mt-5 space-y-4">
                    <div>
                      <label className="field-label">New password</label>
                      <input type="password" placeholder="Enter your new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="field" />
                    </div>
                    <div>
                      <label className="field-label">Confirm password</label>
                      <input type="password" placeholder="Enter 6+ characters" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="field" />
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
                  <p className="text-sm uppercase tracking-[0.24em] text-rose-400">Danger zone</p>
                  <h3 className="mt-3 text-xl font-bold text-[var(--foreground)]">Delete account</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
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
              <h3 className="mt-3 text-2xl font-bold text-[var(--foreground)]">Are you sure you want to continue?</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                This action cannot be undone. Type <span className="font-bold text-[var(--foreground)]">DELETE</span> to confirm permanent removal.
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
