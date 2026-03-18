"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Runs in root layout. If the URL has Supabase auth tokens in the hash
 * (e.g. password reset link that landed on /dashboard or /login), recover
 * the session and redirect to set-password or dashboard. This prevents
 * the server from redirecting to login and dropping the hash.
 */
function hasAuthHash(): boolean {
  if (typeof window === "undefined") return false;
  const hash = window.location.hash.slice(1);
  if (!hash) return false;
  const params = new URLSearchParams(hash);
  return !!(params.get("access_token") && params.get("refresh_token"));
}

export function AuthHashHandler() {
  const [handling, setHandling] = useState(hasAuthHash);

  useEffect(() => {
    if (!handling) return;

    const next = new URLSearchParams(window.location.search).get("next");
    const safeNext = next && next.startsWith("/") ? next : null;

    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (!accessToken || !refreshToken) {
      setHandling(false);
      return;
    }

    const supabase = createClient();
    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(() => {
        // Full-page navigation so the next page gets the session cookie reliably
        if (safeNext) {
          window.location.href = safeNext;
          return;
        }
        if (type === "recovery") {
          window.location.href = "/reset-password";
        } else {
          window.location.href = "/dashboard/my-listings";
        }
      })
      .catch(() => setHandling(false));
  }, []);

  if (!handling) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <p className="text-zinc-600 dark:text-zinc-400">Completing sign in…</p>
    </div>
  );
}
