"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

/**
 * ProtectedRoute Component
 * -----------------------
 * Wraps around pages/components that require authentication.
 * Redirects to /login if the user is not authenticated.
 */
export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/login");
      else setLoading(false);
    };
    checkUser();
  }, [router]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="panel rounded-[2rem] px-8 py-6 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Secure access</p>
        <p className="mt-3 text-lg font-bold text-[var(--foreground)]">Checking authentication...</p>
      </div>
    </div>
  );

  return <>{children}</>;
}
