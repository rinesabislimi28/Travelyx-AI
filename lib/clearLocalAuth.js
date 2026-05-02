/**
 * Clear Local Auth Utility
 * 
 * Helper function to safely clear all Supabase authentication tokens,
 * local storage, session storage, and cookies to ensure a complete logout
 * and prevent stale session bugs across devices.
 */
export function clearLocalAuth() {
  if (typeof window === "undefined") return;

  const shouldRemove = (key) =>
    key.startsWith("sb-") ||
    key.includes("supabase") ||
    key.includes("auth-token");

  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (key && shouldRemove(key)) localStorage.removeItem(key);
  }

  for (let index = sessionStorage.length - 1; index >= 0; index -= 1) {
    const key = sessionStorage.key(index);
    if (key && shouldRemove(key)) sessionStorage.removeItem(key);
  }

  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();
    if (!name || !shouldRemove(name)) return;
    document.cookie = `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`;
  });
}
