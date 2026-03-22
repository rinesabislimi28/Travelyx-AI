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

  if (loading) return <p className="text-center mt-20">Checking authentication...</p>;

  return <>{children}</>;
}