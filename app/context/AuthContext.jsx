// app/context/AuthContext.jsx
"use client";

/**
 * AuthContext & AuthProvider
 * ---------------------------
 * Provides global authentication state using Supabase Auth.
 * Stores the current user and loading status.
 * Wrap your app with AuthProvider in layout.tsx.
 */

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

// ----------------------------
// CREATE CONTEXT
// ----------------------------
const AuthContext = createContext(null);

// ----------------------------
// AUTH PROVIDER COMPONENT
// ----------------------------
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // Store logged-in user info
  const [loading, setLoading] = useState(true); // Loading state while checking session

  useEffect(() => {
    // ----------------------------
    // GET CURRENT SESSION
    // ----------------------------
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error("Session error:", error.message);

        setUser(data?.session?.user ?? null); // Set current user or null
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false); // Done loading
      }
    };

    getSession();

    // ----------------------------
    // LISTEN FOR AUTH STATE CHANGES
    // ----------------------------
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null); // Update user on login/logout
      }
    );

    // ----------------------------
    // CLEANUP ON UNMOUNT
    // ----------------------------
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // ----------------------------
  // PROVIDE CONTEXT VALUE
  // ----------------------------
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ----------------------------
// CUSTOM HOOK
// ----------------------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};