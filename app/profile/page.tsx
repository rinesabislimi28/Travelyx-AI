"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  
  // State variables for showing user data
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // States for updating Name
  const [fullName, setFullName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  
  // States for Password Change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  // Feedback Messages
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteAccountText, setDeleteAccountText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
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

  // --- 1. UPDATE NAME ---
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || fullName === user?.user_metadata?.full_name) return;
    setIsUpdatingName(true);
    
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    });

    if (error) {
      showFeedback("error", error.message);
    } else {
      showFeedback("success", "Profile name updated successfully!");
    }
    setIsUpdatingName(false);
  };

  // --- 2. UPDATE PASSWORD ---
  /**
   * handleUpdatePassword
   * Securely authenticates and updates the user's password utilizing Supabase.
   * Enforces strict regex policies (at least 6 chars, 1 letter, 1 number, 1 special char).
   */
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
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
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      showFeedback("error", error.message);
    } else {
      showFeedback("success", "Password updated successfully. Next time you login, use your new password.");
      setNewPassword("");
      setConfirmPassword("");
    }
    setIsUpdatingPassword(false);
  };

  // --- 3. DELETE ACCOUNT ---
  /**
   * handleDeleteAccount
   * Calls a dedicated server-side API route (/api/delete-user) using the
   * Service Role Key to bypass RLS and completely erase the user's Auth record.
   * Cascade deletes automatically remove associated 'trips' from the database.
   */
  const handleDeleteAccount = async () => {
    if (deleteAccountText !== "DELETE") {
      return showFeedback("error", "Please type DELETE in all caps to confirm.");
    }

    const confirmed = window.confirm("WARNING: This action is permanent and cannot be undone. All your connected data and trips will be permanently removed. Proceed?");
    if (!confirmed) return;

    setIsDeleting(true);
    
    try {
      // Fetching the secure, Server-Side API endpoint holding the Service Role Key
      const sessionResponse = await supabase.auth.getSession();
      const token = sessionResponse.data.session?.access_token;
      
      if (!token) throw new Error("Authentication token missing.");

      const response = await fetch('/api/auth/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account from server.");
      }

      // If backend deletion succeeds, log out the client
      await supabase.auth.signOut();
      router.push("/login");

    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setIsDeleting(false);
    }
  };


  if (loading) {
     return (
       <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center">
         <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
         <p className="mt-4 text-indigo-900 font-bold animate-pulse">Loading secure profile...</p>
       </div>
     );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#fafcff] relative flex flex-col items-center py-10 px-4 sm:px-6 overflow-x-hidden">
        
        {/* Dynamic Vibrant Header Mesh */}
        <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-b-[4rem] shadow-2xl z-0 overflow-hidden border-b border-white/20">
           <div className="absolute inset-0 opacity-40 mix-blend-color-dodge pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[350px] h-[350px] bg-cyan-400 blur-[80px] rounded-full animate-blob"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-[350px] h-[350px] bg-pink-400 blur-[80px] rounded-full animate-blob animation-delay-2000"></div>
           </div>
        </div>

        <div className="w-full max-w-5xl z-10 flex justify-between items-center mb-4 pt-4">
          <Link href="/dashboard" className="text-slate-800 bg-white hover:bg-slate-50 px-5 py-2.5 rounded-full font-bold transition-all flex items-center gap-2 shadow-xl hover:-translate-x-1 hover:shadow-indigo-500/20 text-sm">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             Dashboard
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 drop-shadow-md">
             My Settings <span className="text-indigo-300">⚙️</span>
          </h1>
        </div>

        {/* Feedback Toasts */}
        {successMsg && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-50 text-emerald-600 border border-emerald-200 p-4 rounded-2xl shadow-xl flex items-center gap-3 font-bold animate-fade-in-down w-full max-w-sm">
            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            <span className="flex-1 text-sm">{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="fixed top-6 right-6 z-50 bg-red-50 text-red-600 border border-red-200 p-4 rounded-2xl shadow-xl flex items-center gap-3 font-bold animate-fade-in-down w-full max-w-sm">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="flex-1 text-sm">{errorMsg}</span>
          </div>
        )}

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-5 z-10">
          
          {/* LEFT COLUMN: Overview & Personal Details */}
          <div className="md:col-span-12 lg:col-span-7 flex flex-col gap-5">
            
            {/* Minimalist Profile Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-5 text-white border border-indigo-500/30">
              <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/5 rounded-full blur-2xl font-black text-[150px] flex items-center justify-center opacity-20 transform rotate-12 pointer-events-none">✈️</div>
              
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/20 shadow-xl flex items-center justify-center text-4xl font-extrabold text-white z-10 relative">
                {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-400 border-[3px] border-indigo-800 rounded-full shadow-sm"></div>
              </div>
              
              <div className="flex-1 text-center md:text-left z-10">
                <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1 drop-shadow-sm">Travelyx VIP Member</p>
                <h2 className="text-2xl font-black tracking-tight leading-tight mb-1">{user?.user_metadata?.full_name || 'Traveler'}</h2>
                <p className="text-indigo-100 font-medium text-sm flex items-center justify-center md:justify-start gap-2">
                  <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {user?.email}
                </p>
                <div className="mt-5 bg-black/20 backdrop-blur-sm border border-white/10 text-white/90 text-xs px-4 py-2 rounded-xl inline-block font-bold shadow-inner">
                  📅 Joined: {new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric'})}
                </div>
              </div>
            </div>

            {/* Update Info Form */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100">
               <h3 className="font-extrabold text-md text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                 <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                 Personal Details
               </h3>
               
               <form onSubmit={handleUpdateName} className="flex flex-col gap-4">
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Full Name</label>
                   <input
                     type="text"
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all shadow-inner text-sm"
                     placeholder="John Doe"
                   />
                 </div>
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Email Address</label>
                   <input
                     type="text"
                     value={user?.email || ""}
                     disabled
                     className="w-full bg-slate-100 border border-slate-200/50 text-slate-400 rounded-xl p-2.5 font-medium opacity-70 cursor-not-allowed text-sm"
                   />
                 </div>
                 
                 <button 
                  type="submit" 
                  disabled={isUpdatingName || fullName === user?.user_metadata?.full_name}
                  className="mt-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                 >
                   {isUpdatingName ? "Saving changes..." : "Save Details"}
                 </button>
               </form>
            </div>
            
          </div>

          {/* RIGHT COLUMN: Security & Danger Zone */}
          <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-5">
            
            {/* Security Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100">
               <h3 className="font-extrabold text-md text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                 <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                 Security & Password
               </h3>
               
               <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3">
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">New Password</label>
                   <input
                     type="password"
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all text-sm"
                   />
                 </div>
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Confirm New Password</label>
                   <input
                     type="password"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all text-sm"
                   />
                 </div>
                 
                 <button 
                  type="submit" 
                  disabled={isUpdatingPassword || !newPassword || !confirmPassword}
                  className="mt-1 bg-slate-900 hover:bg-black text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                 >
                   {isUpdatingPassword ? "Updating vault..." : "Update Password"}
                 </button>
               </form>
            </div>

            {/* Danger Zone Card */}
            <div className="bg-red-50/50 rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(239,68,68,0.1)] border border-red-100/60 overflow-hidden relative">
               <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none"></div>
               <h3 className="font-extrabold text-md text-red-600 mb-2 flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 Danger Zone
               </h3>
               
               <p className="text-[11px] font-medium text-slate-600 leading-relaxed mb-4">
                 Deleting your account permanently destroys all saved trips and records. 
               </p>

               <div className="flex flex-col gap-2">
                 <input
                   type="text"
                   value={deleteAccountText}
                   onChange={(e) => setDeleteAccountText(e.target.value)}
                   className="w-full bg-white border border-red-200 rounded-xl p-2 focus:ring-4 focus:ring-red-500/20 focus:border-red-400 outline-none text-red-700 font-bold transition-all text-center placeholder:text-red-300 placeholder:font-medium text-sm"
                   placeholder="Type DELETE"
                 />
                 <button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteAccountText !== "DELETE"}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-2.5 rounded-xl transition-all shadow-xl shadow-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                 >
                   {isDeleting ? "Erasing..." : "Delete Account"}
                 </button>
               </div>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
